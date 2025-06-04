// src/app/login/page.tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    setIsMounted(true);
    const redirectedFrom = searchParams.get('redirectedFrom');
    if (redirectedFrom) {
      toast({
        title: "Acesso Necessário",
        description: "Você precisa estar logado para acessar essa página.",
        variant: "default",
      });
    }
     // Check for session on mount, if user is already logged in, redirect
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && isMounted) {
        router.replace('/dashboard');
      }
    };
    checkSession();

  }, [searchParams, toast, supabase, router, isMounted]);


  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (signInError) {
      console.error("Login error:", signInError);
      setError(signInError.message || "Credenciais inválidas ou erro desconhecido.");
      toast({
        title: "Erro no Login",
        description: signInError.message === 'Invalid login credentials' 
          ? 'Email ou senha inválidos.' 
          : 'Ocorreu um erro ao tentar fazer login. Verifique suas credenciais e tente novamente.',
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login Bem-sucedido!",
        description: "Redirecionando para o painel...",
      });
      // router.push will preserve history, replace will not.
      // If user came from a protected route, middleware should handle redirect after session is set.
      // Otherwise, go to dashboard.
      const nextUrl = searchParams.get('next') || '/dashboard';
      router.replace(nextUrl);
    }
  };

  const handleMagicLinkLogin = async () => {
    if (!email) {
      setError("Por favor, insira seu email para usar o login com link mágico.");
      toast({ title: "Email Necessário", description: "Insira seu email para o link mágico.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setError(null);
    setMagicLinkSent(false);

    const { error: magicLinkError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // emailRedirectTo: `${window.location.origin}/api/auth/callback`, // Handled by Supabase settings
      },
    });
    setIsLoading(false);

    if (magicLinkError) {
      console.error("Magic link error:", magicLinkError);
      setError(magicLinkError.message);
      toast({ title: "Erro ao Enviar Link Mágico", description: magicLinkError.message, variant: "destructive" });
    } else {
      setMagicLinkSent(true);
      toast({ title: "Link Mágico Enviado", description: "Verifique seu email para o link de login." });
    }
  };
  
  // Add OAuth login handler (e.g., Google)
  const handleOAuthLogin = async (provider: 'google' | 'github') => { // Add more providers as needed
    setIsLoading(true);
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // redirectTo: `${window.location.origin}/api/auth/callback`, // Handled by Supabase settings
      },
    });
    setIsLoading(false);
    if (oauthError) {
      console.error(`${provider} OAuth error:`, oauthError);
      setError(oauthError.message);
      toast({ title: `Erro de Login com ${provider}`, description: oauthError.message, variant: "destructive" });
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
          <CardTitle className="text-3xl font-bold font-headline">Bem-vindo de volta!</CardTitle>
          <CardDescription>
            Acesse sua conta Estude+ para continuar aprendendo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 flex items-center space-x-2 rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
          {magicLinkSent && !error && (
            <div className="mb-4 rounded-md border border-green-500 bg-green-50 p-3 text-sm text-green-700">
              <p>Link mágico enviado para {email}! Verifique sua caixa de entrada (e spam).</p>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link
                  href="/forgot-password" // TODO: Create this page
                  className="text-sm text-primary hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required  
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full text-base py-3" disabled={isLoading}>
              {isLoading && !magicLinkSent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Entrar
            </Button>
          </form>
          
          <div className="my-4 flex items-center">
            <hr className="flex-grow border-t" />
            <span className="mx-4 text-xs text-muted-foreground">OU</span>
            <hr className="flex-grow border-t" />
          </div>

          <div className="space-y-3">
             <Button variant="outline" className="w-full text-base py-3" onClick={handleMagicLinkLogin} disabled={isLoading || !email}>
              {isLoading && magicLinkSent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Entrar com Link Mágico
            </Button>
            <Button variant="outline" className="w-full text-base py-3" onClick={() => handleOAuthLogin('google')} disabled={isLoading}>
              {/* Add Google Icon here */}
              Entrar com Google
            </Button>
            {/* <Button variant="outline" className="w-full text-base" onClick={() => handleOAuthLogin('github')} disabled={isLoading}>
              Entrar com GitHub
            </Button> */}
          </div>

          <div className="mt-6 text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
