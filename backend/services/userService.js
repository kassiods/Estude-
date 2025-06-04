import supabase from '../supabase.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Função para criar usuário (Supabase Auth e Perfil no Prisma)
async function createUser({ email, password, name }) {
  let userId; 

  try {
    // 1. Create user in Supabase Auth using admin privileges
    const { data: authAdminData, error: authAdminError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name }, 
      email_confirm: true, // Auto-confirm for seeding/development. Set to false for production email verification.
    });

    if (authAdminError) {
      console.error('Supabase admin.createUser error:', authAdminError.message, authAdminError);
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

    // 2. Create or update user profile in Prisma 'users' table
    // Using upsert to handle cases where the Auth user might exist but profile doesn't, or to update existing.
    const profile = await prisma.user.upsert({
      where: { id: userId }, 
      update: { // Fields to update if user (by id) already exists in Prisma
        email: email,
        name: name,
        updatedAt: new Date(),
      },
      create: { // Fields to create if user (by id) does not exist in Prisma
        id: userId, 
        email: email,
        name: name,
        isPremium: false, // Default value for new profiles
      },
    });
    
    console.log(`Profile for user ${userId} (email: ${email}) ensured in Prisma.`);
    // admin.createUser does not return a session. User will need to log in separately.
    return { user: authAdminData.user, profile }; 

  } catch (error) {
    console.error('Error in createUser service:', error.message, error.stack);
    // If profile creation/upsert in Prisma fails after the Auth user was created,
    // consider a rollback for the Auth user, though this adds complexity.
    // For now, a comprehensive error message is thrown.
    throw new Error(`Falha ao registrar usuário: ${error.message}`);
  }
}

async function loginUser({ email, password }) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase signInWithPassword error:', error.message);
      // Provide more user-friendly messages for common errors
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Email ou senha inválidos.');
      }
      throw new Error(error.message || 'Falha ao fazer login.');
    }

    if (data.user && data.user.id) {
        // After successful Supabase Auth login, fetch user profile from Prisma
        let profile = await prisma.user.findUnique({
            where: { id: data.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                isPremium: true,
                createdAt: true,
                updatedAt: true,
                // Add other profile fields you want to return
            }
        });

        if (!profile) {
            // This case handles if a user exists in Auth but their profile is missing in Prisma.
            // This might happen due to incomplete sign-up or data migration issues.
            // Attempt to create a profile for them.
            console.warn(`Login successful, but profile not found in Prisma for user ID: ${data.user.id}. Attempting to create it.`);
            try {
                profile = await prisma.user.create({
                    data: {
                        id: data.user.id,
                        email: data.user.email, // email from Auth user
                        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Novo Usuário', // try to get name from metadata
                        isPremium: data.user.user_metadata?.is_premium || false, // default to false
                    },
                    select: { id: true, name: true, email: true, isPremium: true, createdAt: true, updatedAt: true }
                });
                console.log(`Successfully created missing profile for user ID: ${data.user.id}`);
            } catch (creationError) {
                console.error(`Failed to create missing profile for user ID ${data.user.id}:`, creationError);
                // If profile creation fails, log it but still return auth data.
                // The frontend might need to handle this scenario (e.g., prompt for profile setup).
            }
        }
        
        // Combine Supabase auth user data with Prisma profile data
        const combinedUser = { ...data.user, ...profile }; 
        return { ...data, user: combinedUser }; // Return original Supabase data (session, etc.) + combined user
    }
    // This should ideally not be reached if Supabase returns user data on successful login.
    throw new Error('Login bem-sucedido, mas dados do usuário não retornados pelo Supabase Auth.');
  } catch (error) {
    console.error('Error in loginUser service:', error.message, error.stack);
    // Re-throw the error to be caught by the controller
    throw error; // No need to wrap in new Error(`Falha no login: ${error.message}`) if it's already an Error.
  }
}

async function getUserById(userId) {
  console.log(`Buscando perfil para o usuário ID: ${userId} na tabela 'users' (Prisma)`);
  try {
      const userProfile = await prisma.user.findUnique({
          where: { id: userId },
          select: { 
              id: true,
              name: true,
              email: true,
              isPremium: true,
              createdAt: true,
              updatedAt: true,
              // Add more fields if necessary (e.g., admin, progressSummary)
          },
      });
      
      if (!userProfile) {
          console.warn(`Perfil não encontrado na tabela 'users' (Prisma) para o usuário ID: ${userId}.`);
          return null; // Or throw an error if a profile is always expected
      }
      console.log(`Perfil encontrado para o usuário ID: ${userId}`, userProfile);
      return userProfile;
  } catch (error) {
      console.error('Prisma getUserById error:', error.message, error.stack);
      throw new Error(`Erro ao buscar perfil do usuário: ${error.message}`);
  }
}

async function updateUserProfile(userId, updates) {
  // Prevent disallowed fields from being updated
  delete updates.email; 
  delete updates.id;    
  // isPremium status should be handled by a dedicated mechanism (e.g., payment webhook)
  delete updates.isPremium; 

  updates.updatedAt = new Date();

  try {
      const updatedProfile = await prisma.user.update({
          where: { id: userId },
          data: updates,
          select: { // Return the updated fields
              id: true,
              name: true,
              email: true, // email is not updated, but good to return for consistency
              isPremium: true, // isPremium is not updated, but good to return
              updatedAt: true,
              // Add other fields as needed
          }
      });
      return updatedProfile;
  } catch (error) {
      console.error('Prisma updateUserProfile error:', error.message, error.stack);
      // Handle specific Prisma errors, e.g., P2025 for record not found
      if (error.code === 'P2025') {
          throw new Error('Perfil do usuário não encontrado para atualização.');
      }
      throw new Error(`Erro ao atualizar perfil do usuário: ${error.message}`);
  }
}

export {
  createUser,
  loginUser,
  getUserById,
  updateUserProfile,
};
