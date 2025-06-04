// src/app/api/users/me/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser) {
    console.error('Auth error in /api/users/me:', authError?.message);
    return NextResponse.json({ error: "Não autenticado ou sessão inválida." }, { status: 401 });
  }

  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: authUser.id },
      // Select specific fields you want to return, avoid sending sensitive data
      select: {
        id: true,
        email: true,
        name: true,
        isPremium: true,
        createdAt: true,
        // Do not select passwordHash or other sensitive fields
      }
    });

    if (!userProfile) {
      // This case means the user exists in Supabase Auth but not in your Prisma `profiles` table.
      // This could happen if profile creation failed during signup or if it's an old user.
      // Consider creating a profile here if it's missing (idempotently) or returning a specific error.
      console.warn(`Profile not found in Prisma for auth user ID: ${authUser.id}. Email: ${authUser.email}`);
       // Attempt to create a profile if it's missing.
       // This makes the /me endpoint more resilient if profile creation during signup failed.
       const newProfile = await prisma.user.create({
        data: {
          id: authUser.id,
          email: authUser.email!, // email should exist if authUser is present
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0], // Get name from metadata or derive
          isPremium: false, // Default value
        },
         select: { id: true, email: true, name: true, isPremium: true, createdAt: true }
      });
      console.log(`Created missing profile for user ID: ${authUser.id}`);
      return NextResponse.json(newProfile);
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile from Prisma:", error);
    return NextResponse.json({ error: "Falha ao buscar perfil do usuário." }, { status: 500 });
  }
}

// TODO: Implement PUT/PATCH to update user profile if needed
// export async function PUT(request: NextRequest) { ... }
