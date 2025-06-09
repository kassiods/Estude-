
// src/app/(app)/settings/page.tsx
"use client";

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { Palette, Bell, Shield, Trash2, Moon, Sun, Laptop, UserCircle2 } from 'lucide-react';


export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const handleDeleteAccount = () => {
    toast({
      title: "Conta Excluída (Simulado)",
      description: "Sua conta foi excluída da plataforma.",
      variant: "destructive",
    });
  };


  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center font-headline">
             Configurações
          </CardTitle>
          <CardDescription>Gerencie as preferências da sua conta e da aplicação.</CardDescription>
        </CardHeader>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center font-headline">
            <UserCircle2 className="mr-3 h-7 w-7 text-primary" /> Informações do Perfil (Demonstrativo)
          </CardTitle>
          <CardDescription>A edição do perfil será habilitada com o backend.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground p-4 border rounded-md bg-muted/50">
                As opções para editar nome, e-mail e foto do perfil estarão disponíveis aqui quando o sistema de autenticação e backend forem implementados.
            </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center font-headline">
            <Palette className="mr-3 h-7 w-7 text-primary" /> Aparência
          </CardTitle>
          <CardDescription>Personalize a aparência do aplicativo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="theme" className="text-base">Tema</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme" className="mt-1 text-base h-11">
                <SelectValue placeholder="Selecione um tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center">
                    <Sun className="mr-2 h-4 w-4"/> Claro
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                   <div className="flex items-center">
                    <Moon className="mr-2 h-4 w-4"/> Escuro
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center">
                    <Laptop className="mr-2 h-4 w-4"/> Sistema
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center font-headline">
            <Bell className="mr-3 h-7 w-7 text-primary" /> Preferências de Notificação (Mock)
          </CardTitle>
          <CardDescription>Escolha como você recebe as atualizações.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <Label htmlFor="emailNotifications" className="text-base flex-1">Notificações por E-mail</Label>
            <Switch id="emailNotifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <Label htmlFor="pushNotifications" className="text-base flex-1">Notificações Push no App</Label>
            <Switch id="pushNotifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>
           <p className="text-xs text-muted-foreground text-center pt-2">Estas configurações são apenas demonstrativas.</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center font-headline">
            <Shield className="mr-3 h-7 w-7 text-primary" /> Gerenciamento da Conta (Mock)
          </CardTitle>
          <CardDescription>Opções para gerenciar sua conta na plataforma.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full text-base h-11" onClick={() => toast({ title: "Funcionalidade Mock", description: "A alteração de senha é apenas demonstrativa."})}>
            Alterar Senha
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full text-base h-11">
                <Trash2 className="mr-2 h-5 w-5"/> Excluir Conta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta (simulado)
                  e removerá seus dados de nossos servidores (simulado).
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                  Sim, excluir conta
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <p className="text-xs text-muted-foreground text-center pt-2">Estas ações de gerenciamento de conta são apenas demonstrativas.</p>
        </CardContent>
      </Card>
    </div>
  );
}
