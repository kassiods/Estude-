
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookHeart, LogIn, UserPlus } from 'lucide-react';

export default function WelcomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8 text-center">
      <BookHeart className="h-20 w-20 text-primary mb-6" />
      <h1 className="text-5xl font-bold mb-4 font-headline text-foreground">
        Bem-vindo ao Estude+
      </h1>
      <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
        Sua plataforma completa para organizar seus estudos, acessar materiais e interagir com uma comunidade de aprendizado.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="text-lg px-8 py-6">
          <Link href="/login">
            <LogIn className="mr-2 h-5 w-5" />
            Entrar
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
          <Link href="/register">
            <UserPlus className="mr-2 h-5 w-5" />
            Cadastre-se
          </Link>
        </Button>
      </div>
      <p className="mt-12 text-sm text-muted-foreground">
        Continue como convidado (simulado):{' '}
        <Link href="/dashboard" className="underline hover:text-primary">
          Acessar Painel
        </Link>
      </p>
    </main>
  );
}
