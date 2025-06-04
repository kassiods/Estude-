// src/app/auth/auth-code-error/page.tsx
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="items-center text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <CardTitle className="text-2xl font-bold">Erro de Autenticação</CardTitle>
          <CardDescription>
            Ocorreu um problema ao tentar processar sua autenticação.
            Isso pode acontecer se o link de confirmação ou login mágico expirou ou já foi utilizado.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-muted-foreground">
            Por favor, tente fazer login novamente. Se o problema persistir, entre em contato com o suporte.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Voltar para Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
