
// src/app/(app)/settings/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { UserCircle, Palette, Bell, Shield, Edit3, Save, X, Trash2, Moon, Sun, Laptop } from 'lucide-react';

// Mock user data - em uma aplicação real, viria do estado global ou API
const mockUser = {
  name: 'Usuário Estude+',
  email: 'usuario@estude.plus',
  avatarUrl: 'https://placehold.co/150x150.png?text=EP',
  initials: 'EP',
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(mockUser.name);
  const [profileAvatarUrl, setProfileAvatarUrl] = useState(mockUser.avatarUrl);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const handleProfileSave = () => {
    // Simula o salvamento
    mockUser.name = profileName;
    mockUser.avatarUrl = profileAvatarUrl;
    setIsEditingProfile(false);
    toast({
      title: "Perfil Atualizado (Simulado)",
      description: "Suas informações de perfil foram salvas.",
    });
  };

  const handleProfileCancel = () => {
    setProfileName(mockUser.name);
    setProfileAvatarUrl(mockUser.avatarUrl);
    setIsEditingProfile(false);
  };

  const handleDeleteAccount = () => {
    // Simula a exclusão da conta
    toast({
      title: "Conta Excluída (Simulado)",
      description: "Sua conta foi excluída da plataforma.",
      variant: "destructive",
    });
    // Em uma app real, redirecionaria para uma página de despedida ou login
  };


  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center font-headline">
            <UserCircle className="mr-3 h-8 w-8 text-primary" /> Configurações do Perfil
          </CardTitle>
          <CardDescription>Gerencie suas informações pessoais e detalhes da conta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={isEditingProfile ? profileAvatarUrl : mockUser.avatarUrl} alt={mockUser.name} data-ai-hint="user avatar" />
              <AvatarFallback>{mockUser.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{isEditingProfile ? profileName : mockUser.name}</h3>
              <p className="text-muted-foreground">{mockUser.email}</p>
            </div>
            {!isEditingProfile ? (
              <Button variant="outline" size="icon" className="ml-auto" onClick={() => setIsEditingProfile(true)}>
                <Edit3 className="h-5 w-5" />
                <span className="sr-only">Editar Perfil</span>
              </Button>
            ) : (
              <div className="ml-auto flex gap-2">
                 <Button variant="ghost" size="icon" onClick={handleProfileCancel}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Cancelar</span>
                </Button>
                <Button size="icon" onClick={handleProfileSave}>
                    <Save className="h-5 w-5" />
                    <span className="sr-only">Salvar</span>
                </Button>
              </div>
            )}
          </div>

          {isEditingProfile && (
            <div className="space-y-4 pt-4 border-t">
              <div>
                <Label htmlFor="profileName" className="text-base">Nome</Label>
                <Input id="profileName" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="mt-1 text-base h-11" />
              </div>
              <div>
                <Label htmlFor="profileAvatarUrl" className="text-base">URL do Avatar</Label>
                <Input id="profileAvatarUrl" value={profileAvatarUrl} onChange={(e) => setProfileAvatarUrl(e.target.value)} className="mt-1 text-base h-11" />
              </div>
            </div>
          )}
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

    