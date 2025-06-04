
// src/app/api/users/me/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { z } from 'zod';

const userProfileUpdateSchema = z.object({
  name: z.string().min(1, "Nome não pode estar vazio.").max(255).optional(),
  // email cannot be updated here directly, must be done via Supabase auth methods
  // photo_url: z.string().url("URL da foto inválida.").optional().nullable(), // Assuming photo_url is on User model
  // is_premium status changes should be handled by a separate, more secure mechanism (e.g., payment webhook)
});


export async function GET(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser) {
    console.warn('Auth error or no user session in /api/users/me:', authError?.message);
    return NextResponse.json({ error: "Não autenticado ou sessão inválida." }, { status: 401 });
  }

  try {
    let userProfile = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        email: true,
        name: true,
        isPremium: true,
        createdAt: true,
        updatedAt: true,
        // Include other fields as needed by the frontend profile page
      }
    });

    if (!userProfile) {
      // Profile doesn't exist in Prisma `users` table, attempt to create it.
      // This can happen if the user signed up but the profile creation step failed or was missed.
      console.warn(`Profile not found in Prisma for auth user ID: ${authUser.id}. Email: ${authUser.email}. Attempting to create.`);
      try {
        userProfile = await prisma.user.create({
          data: {
            id: authUser.id,
            email: authUser.email!, 
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Novo Usuário',
            isPremium: authUser.user_metadata?.is_premium || false, // Default to false
          },
          select: { // Select the same fields as above
            id: true, email: true, name: true, isPremium: true, createdAt: true, updatedAt: true,
          }
        });
        console.log(`Successfully created missing profile for user ID: ${authUser.id}`);
      } catch (creationError) {
        console.error(`Failed to create missing profile for user ID ${authUser.id}:`, creationError);
        // If profile creation fails, it's a server issue.
        return NextResponse.json({ error: "Falha ao inicializar perfil do usuário." }, { status: 500 });
      }
    }
    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Error fetching/creating user profile from Prisma:", error);
    return NextResponse.json({ error: "Falha ao buscar/criar perfil do usuário." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = userProfileUpdateSchema.parse(body);

    // Ensure user cannot update their own 'isPremium' status or 'email' via this generic update endpoint
    const { name } = validatedData; // Only allow 'name' and 'photo_url' (if added to schema) to be updated here

    const updatedProfile = await prisma.user.update({
      where: { id: authUser.id },
      data: {
        name: name,
        // photo_url: photo_url (if you add it to schema and validation)
        updatedAt: new Date(), // Manually set updatedAt
      },
      select: { // Return the updated profile with the same fields as GET
        id: true, email: true, name: true, isPremium: true, createdAt: true, updatedAt: true,
      }
    });

    // If name was updated, also update Supabase Auth user_metadata (optional, but good for consistency)
    if (name && name !== authUser.user_metadata?.name) {
      const { error: updateMetaError } = await supabase.auth.updateUser({
        data: { name: name }
      });
      if (updateMetaError) {
        console.warn("Failed to update name in Supabase Auth user_metadata:", updateMetaError.message);
        // Not a critical error, profile in DB is updated. Log and continue.
      }
    }

    return NextResponse.json(updatedProfile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos.", details: error.errors }, { status: 400 });
    }
    console.error("Error updating user profile:", error);
    // Check for Prisma P2025 error (record not found) if needed, though GET handles creation.
    return NextResponse.json({ error: "Falha ao atualizar perfil." }, { status: 500 });
  }
}
