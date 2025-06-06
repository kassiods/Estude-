
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Corrected import
import { Loader2 } from 'lucide-react';

export default function HomePageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="mt-4 text-lg text-muted-foreground">Redirecionando para o painel...</p>
    </main>
  );
}
