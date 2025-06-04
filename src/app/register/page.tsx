// src/app/register/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookHeart, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    setIsMounted(true);
    // Check for session on mount, if user is already logged in, redirect
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && isMounted) { // Check isMounted here
        router.replace('/dashboard');
      }
    };
    checkSession();
  }, [supabase, router, isMounted]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name, // Store name in user_metadata
        },
        // emailRedirectTo: `${window.location.origin}/api/auth/callback`, // Optional: Handled by Supabase settings
      },
    });

    setIsLoading(false);

    if (signUpError) {
      console.error("Registration error:", signUpError);
      setError(signUpError.message);
      toast({
        title: "Erro no Cadastro",
        description: signUpError.message,
        variant: "destructive",
      });
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      // This case might indicate that email confirmation is required but the user already exists (unconfirmed).
      // Supabase signUp doesn't return an error for "User already registered" if email confirmation is pending.
      // It returns a user object but with identities array empty.
      setError("Este email já pode estar registrado mas não confirmado. Tente fazer login ou verifique seu email para confirmação.");
      toast({
        title: "Verifique seu Email",
        description: "Um email de confirmação pode ter sido enviado anteriormente. Tente fazer login ou verifique sua caixa de entrada.",
        variant: "default",
      });
    }
     else if (data.user) {
      toast({
        title: "Cadastro Quase Completo!",
        description: "Enviamos um link de confirmação para o seu email. Por favor, verifique sua caixa de entrada (e spam) para ativar sua conta.",
      });
      // Optionally redirect to a page saying "check your email" or login page
      // router.push("/login?message=check-email");
    }
  };
  
  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
           <div className="flex justify-center items-center mb-4">
            <BookHeart className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Crie sua Conta Estude+</CardTitle>
          <CardDescription>
            Junte-se à nossa comunidade e comece a aprender hoje!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 flex items-center space-x-2 rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Seu Nome Completo"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Crie uma senha forte"
                required
                minLength={6} // Supabase default min password length
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full text-base py-3" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Criar Conta
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
