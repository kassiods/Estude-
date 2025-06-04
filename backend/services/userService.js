
const supabase = require('../supabase');

async function createUser({ email, password, name }) {
  // 1. Create the user with Supabase Auth using admin privileges
  // This is preferred for server-side user creation.
  const { data: authAdminData, error: authAdminError } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { name: name }, // Store name in user_metadata as well
    email_confirm: false, // Set to true if you want email confirmation. For now, auto-confirm.
  });

  if (authAdminError) {
    console.error('Supabase admin.createUser error:', authAdminError);
    // More specific error messages can be returned to the client if needed
    if (authAdminError.message.includes('unique constraint')) {
        throw new Error('Um usuário com este email já existe.');
    }
    if (authAdminError.message.includes('Password should be at least 6 characters')) {
        throw new Error('A senha deve ter pelo menos 6 caracteres.');
    }
    throw authAdminError;
  }

  // Ensure user object and ID are available
  if (!authAdminData.user || !authAdminData.user.id) {
    console.error('User object or ID not available after admin.createUser.');
    throw new Error('Falha ao obter ID do usuário após o registro via admin.');
  }
  
  const userId = authAdminData.user.id;

  // 2. Create a profile for the user in the 'profiles' table
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .insert([{ 
        id: userId,         // Link to the auth.users table
        name: name,         // Use the name passed to the function
        email: email,       // Use the email passed to the function (same as authAdminData.user.email)
        photo_url: null,    // Set a default or leave null
        is_premium: false,  // Default value
     }])
    .select()
    .single();

  if (profileError) {
    console.error('Supabase create profile error:', profileError);
    // If profile creation fails, you might want to clean up the auth user created by admin.createUser.
    // This adds complexity (e.g., await supabase.auth.admin.deleteUser(userId)).
    // For now, we'll throw, which will result in a 400 or 500 error from the controller.
    // Check RLS policies on 'profiles' table if not using service_role or if it still fails.
    // However, service_role should bypass RLS.
    // Also check table constraints.
    throw profileError; 
  }
  
  // admin.createUser does not return a session. 
  // The user will need to log in separately after registration.
  // This is a common pattern for server-side registration.
  // We return the created auth user and the profile. Session will be null.
  return { user: authAdminData.user, session: null, profile: profileData };
}

async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Supabase loginUser error:', error);
    throw error;
  }

  if (data.user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, name, email, photo_url, is_premium, created_at')
      .eq('id', data.user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') { 
      console.error('Supabase getProfileForLogin error:', profileError);
      // Login successful but profile missing? This shouldn't happen if registration works.
      // For now, we proceed, but this indicates a data integrity issue.
    }
    
    const combinedUser = { ...data.user, ...profile };
    return { ...data, user: combinedUser };
  }
  return data; // Should ideally always have data.user if login is successful
}

async function getUserById(userId) {
  const { data, error } = await supabase
    .from('profiles') 
    .select('id, name, email, photo_url, is_premium, created_at') 
    .eq('id', userId)
    .single();

  if (error && error.code === 'PGRST116') { // PGRST116: 0 rows, means profile not found
     console.warn(`Profile not found for user ID: ${userId}`);
     return null; // Return null explicitly if profile not found
  }
  if (error) {
     console.error('Supabase getUserById error:', error);
     throw error;
  }
  return data; 
}

async function updateUserProfile(userId, updates) {
  delete updates.email; // Email should not be updated via this profile update
  delete updates.id;    // ID should not be updated
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('id, name, email, photo_url, is_premium, created_at')
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
