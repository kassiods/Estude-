
// src/app/api/auth/callback/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL, otherwise default to dashboard
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Successfully exchanged code, redirect to the intended page or dashboard
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('Error exchanging code for session:', error.message);
    // Fallthrough to error page if exchange fails
  } else {
    console.error('No code found in auth callback query params.');
  }

  // Redirect to an error page if code is missing or exchange failed
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
