
// src/app/api/auth/callback/route.ts
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Authentication callback endpoint is not active." }, { status: 404 });
}
