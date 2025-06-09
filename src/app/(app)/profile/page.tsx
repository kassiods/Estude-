
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Info } from "lucide-react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-accent p-8 md:p-12">
          <div className="flex items-center gap-6">
            <UserCircle className="h-24 w-24 text-primary-foreground" />
            <div>
              <CardTitle className="text-4xl font-bold text-primary-foreground font-headline">Meu Perfil</CardTitle>
              <CardDescription className="text-lg text-primary-foreground/80">
                Suas informações de perfil e atividades na plataforma.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-muted rounded-lg">
            <Info className="h-16 w-16 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold text-muted-foreground mb-3">
              Funcionalidade de Perfil em Breve
            </h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Esta seção exibirá suas informações pessoais, cursos salvos, histórico de estudos e estatísticas de progresso
              assim que o sistema de backend e autenticação estiverem implementados.
            </p>
            <Button asChild variant="outline">
                <Link href="/dashboard">Voltar ao Painel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
       <p className="text-center text-sm text-muted-foreground pt-4">
        A funcionalidade de perfil completo será habilitada com a integração do backend.
      </p>
    </div>
  );
}
