
// src/app/api/users/me/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
// createSupabaseServerClient and z are not used as auth is dismantled.

// Mock user data since auth is removed
const mockUser = {
  id: 'mockUserId123',
  email: 'usuario.mock@estude.plus',
  name: 'Usuário Mockado',
  isPremium: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function GET(request: NextRequest) {
  // Since authentication is removed, we return a mock user or an appropriate message.
  // For now, let's return a mock user to keep profile page somewhat functional.
  // Or, indicate that the endpoint is not fully functional without auth:
  // return NextResponse.json({ message: "User profile endpoint. Authentication system is currently inactive." });
  
  // Returning mock user:
  return NextResponse.json(mockUser);
}

export async function PUT(request: NextRequest) {
  // Authentication is removed, so this endpoint cannot securely update a specific user.
  return NextResponse.json({ error: "Operação não permitida. Sistema de autenticação inativo." }, { status: 403 });
}
