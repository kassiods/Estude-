const supabase = require('../supabase');

async function createUser({ email, password, name }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name, // Custom user metadata
      },
    },
  });

  if (error) {
    console.error('Supabase createUser error:', error);
    throw error;
  }
  // The 'data' object for signUp contains user and session if successful.
  // If email confirmation is required, data.user will be present but data.session will be null.
  return data; 
}

// Placeholder for login function
async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Supabase loginUser error:', error);
    throw error;
  }
  return data; // Contains user and session
}

// Placeholder for getting user data
async function getUserById(userId) {
  // This would typically fetch user profile data from a 'profiles' table,
  // not directly from supabase.auth.user() which is client-side oriented
  // or requires an authenticated session/JWT for server-side.
  // For this example, we'll assume you have a 'profiles' table linked by user ID.
  const { data, error } = await supabase
    .from('profiles') // Assuming you have a 'profiles' table
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: 0 rows
     console.error('Supabase getUserById error:', error);
     throw error;
  }
  return data;
}

// Placeholder for updating user profile
async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles') // Assuming you have a 'profiles' table
    .update(updates)
    .eq('id', userId)
    .select()
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
