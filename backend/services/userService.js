
const supabase = require('../supabase');

async function createUser({ email, password, name }) {
  let userId; // Variável para armazenar o ID do usuário do Auth

  try {
    // 1. Create the user with Supabase Auth using admin privileges
    const { data: authAdminData, error: authAdminError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name }, 
      email_confirm: false, // Defina como true se quiser confirmação por email. Por agora, auto-confirma.
    });

    if (authAdminError) {
      console.error('Supabase admin.createUser error:', authAdminError.message, authAdminError);
      // Mensagens de erro mais específicas podem ser retornadas ao cliente se necessário
      if (authAdminError.message.includes('unique constraint') || authAdminError.message.includes('already registered')) {
          throw new Error('Um usuário com este email já existe.');
      }
      if (authAdminError.message.includes('Password should be at least 6 characters')) {
          throw new Error('A senha deve ter pelo menos 6 caracteres.');
      }
      throw new Error(authAdminError.message || 'Falha ao criar usuário no Supabase Auth.');
    }

    if (!authAdminData.user || !authAdminData.user.id) {
      console.error('User object or ID not available after admin.createUser.');
      throw new Error('Falha ao obter ID do usuário após o registro via admin.');
    }
    
    userId = authAdminData.user.id;

    // 2. Create a profile for the user in the 'profiles' table
    console.log(`Tentando criar perfil para o usuário ID: ${userId}, Email: ${email}, Nome: ${name}`);
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([{ 
          id: userId,         // Link para a tabela auth.users
          name: name,         
          email: email,       // Armazenar email aqui também para facilitar consultas em perfis
          photo_url: null,    // Definir um padrão ou deixar nulo
          is_premium: false,  // Valor padrão
       }])
      .select()
      .single();

    if (profileError) {
      console.error(`Supabase create profile error for user ID ${userId}:`, profileError.message, profileError);
      // Tentar deletar o usuário do Auth para manter consistência
      let detailedErrorMessage = `Falha ao criar perfil do usuário após registro. Detalhe do erro: ${profileError.message}`;
      if (profileError.code === '23505') { // PostgreSQL unique_violation (e.g., email or id already exists in profiles)
        detailedErrorMessage = `Falha ao criar perfil: um perfil com este email ou ID já pode existir na tabela 'profiles'. Usuário Auth ${userId} pode precisar de limpeza ou verificação manual. Detalhe Supabase: ${profileError.details || profileError.message}`;
      }

      if (userId) {
        console.warn(`Falha ao criar perfil para ${userId}. Tentando deletar usuário do Auth para manter consistência...`);
        const { error: deleteUserError } = await supabase.auth.admin.deleteUser(userId);
        if (deleteUserError) {
          console.error(`CRÍTICO: Falha ao criar perfil E falha ao deletar usuário do Auth ${userId}:`, deleteUserError.message);
          detailedErrorMessage += ` Tentativa de deletar usuário Auth ${userId} também falhou: ${deleteUserError.message}. Requer intervenção manual.`;
        } else {
          console.log(`Usuário Auth ${userId} deletado com sucesso após falha na criação do perfil.`);
          detailedErrorMessage += ` Usuário Auth ${userId} foi deletado para tentar manter a consistência.`;
        }
      }
      throw new Error(detailedErrorMessage);
    }
    
    console.log(`Perfil criado com sucesso para o usuário ID: ${userId}`, profileData);
    // admin.createUser não retorna uma sessão. 
    // O usuário precisará fazer login separadamente após o registro.
    return { user: authAdminData.user, session: null, profile: profileData };

  } catch (error) {
    // Se o erro já foi tratado e lançado como uma instância de Error, relance-o
    // Caso contrário, crie um novo Error
    console.error('Erro geral em createUser:', error.message, error.stack);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Ocorreu um erro inesperado durante a criação do usuário.');
  }
}

async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Supabase loginUser error:', error);
    // Personalizar mensagens de erro com base no erro do Supabase
    if (error.message.includes('Invalid login credentials')) {
        throw new Error('Email ou senha inválidos.');
    }
    throw new Error(error.message || 'Falha ao fazer login.');
  }

  if (data.user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, name, email, photo_url, is_premium, created_at')
      .eq('id', data.user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') { // PGRST116: 0 linhas (perfil não encontrado)
      console.error('Supabase getProfileForLogin error:', profileError);
      // O login foi bem-sucedido, mas o perfil está ausente? Isso indica um problema de integridade de dados.
      // Por agora, vamos prosseguir, mas isso deve ser investigado.
      // Pode ser um usuário antigo sem perfil ou uma falha no processo de criação do perfil.
    }
    
    // Combina dados do usuário Auth com dados do perfil
    const combinedUser = { ...data.user, ...profile }; // Se o perfil for nulo, os campos do perfil não sobrescreverão nada.
    return { ...data, user: combinedUser }; // data aqui inclui user e session
  }
  // Se data.user não existir, mesmo sem erro, é um estado inesperado.
  throw new Error('Login bem-sucedido, mas dados do usuário não retornados.');
}

async function getUserById(userId) {
  console.log(`Buscando perfil para o usuário ID: ${userId} na tabela 'profiles'`);
  const { data, error } = await supabase
    .from('profiles') 
    .select('id, name, email, photo_url, is_premium, created_at') 
    .eq('id', userId)
    .single();

  if (error && error.code === 'PGRST116') { // PGRST116: 0 linhas, significa que o perfil não foi encontrado
     console.warn(`Perfil não encontrado na tabela 'profiles' para o usuário ID: ${userId}. error code: ${error.code}`);
     return null; // Retorna nulo explicitamente se o perfil não for encontrado
  }
  if (error) {
     console.error('Supabase getUserById (profiles) error:', error);
     throw error; // Lança outros erros
  }
  console.log(`Perfil encontrado para o usuário ID: ${userId}`, data);
  return data; 
}

async function updateUserProfile(userId, updates) {
  // Não permitir atualização do email ou id diretamente por aqui.
  // Email é gerenciado pelo Supabase Auth. ID é imutável.
  delete updates.email; 
  delete updates.id;    
  
  // Adicionar 'updated_at' para ser atualizado
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('id, name, email, photo_url, is_premium, created_at, updated_at') // Incluir updated_at no select
    .single(); 
  
  if (error) {
    console.error('Supabase updateUserProfile error:', error);
    throw error;
  }
  return data;
}


module.exports = { 
  createUser,
  loginUser,
  getUserById,
  updateUserProfile
};

