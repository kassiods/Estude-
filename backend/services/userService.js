
const supabase = require('../supabase');

async function createUser({ email, password, name }) {
  // 1. Sign up the user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Optional: Store name in user_metadata, also in profiles table for easier access
      data: {
        name,
      },
    },
  });

  if (authError) {
    console.error('Supabase signUp error:', authError);
    throw authError;
  }

  // Ensure user object and ID are available
  if (!authData.user || !authData.user.id) {
    // This case might happen if email confirmation is enabled and the user object isn't immediately populated with full details.
    // However, authData.user.id should typically be available.
     console.error('User object or ID not available after sign up.');
    throw new Error('Falha ao obter ID do usuário após o registro.');
  }
  
  const userId = authData.user.id;

  // 2. Create a profile for the user in the 'profiles' table
  // Make sure your 'profiles' table has RLS policies that allow signed-up users to insert their own profile,
  // or use the service_role key for this operation if done server-side securely.
  // For this server-side code, Supabase client initialized with service_role key can bypass RLS.
  // If using anon key, RLS must allow this.
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .insert([{ 
        id: userId, // Link to the auth.users table
        name: name, 
        email: email, // Store email here too for easier querying on profiles
        photo_url: null, // Set a default or leave null
        is_premium: false, // Default value
     }])
    .select()
    .single();

  if (profileError) {
    console.error('Supabase create profile error:', profileError);
    // If profile creation fails, you might want to clean up the auth user,
    // but this adds complexity. For now, we'll throw.
    // Check RLS policies on 'profiles' table.
    throw profileError; 
  }
  
  // Return authData (which includes user and session) and the created profile
  return { user: authData.user, session: authData.session, profile: profileData };
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
  // data contains user and session
  // Fetch profile data as well to return a complete user object
  if (data.user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, name, email, photo_url, is_premium, created_at')
      .eq('id', data.user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') { // PGRST116: 0 rows, which is an issue here
      console.error('Supabase getProfileForLogin error:', profileError);
      // Decide how to handle - login successful but profile missing?
    }
    // Combine auth user with profile data
    // Ensure that the structure returned is consistent, e.g. profile data nested or merged.
    // Merging profile into data.user for convenience:
    const combinedUser = { ...data.user, ...profile };
    return { ...data, user: combinedUser };
  }
  return data;
}

async function getUserById(userId) {
  const { data, error } = await supabase
    .from('profiles') 
    .select('id, name, email, photo_url, is_premium, created_at') 
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: 0 rows, means profile not found
     console.error('Supabase getUserById error:', error);
     throw error;
  }
  return data; // data will be null if not found and PGRST116
}

async function updateUserProfile(userId, updates) {
  // Ensure 'email' or 'id' are not in updates if they shouldn't be changed here
  delete updates.email;
  delete updates.id;
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('id, name, email, photo_url, is_premium, created_at') // Select the updated row
    .single(); // Expecting a single row to be updated and returned
  
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
