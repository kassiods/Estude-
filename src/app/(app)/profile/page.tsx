
"use client";

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Edit3, BookMarked, BarChart3, CheckCircle, ShieldCheck, Loader2, CalendarDays } from "lucide-react";
import { CourseCard, type Course } from '@/components/courses/CourseCard'; 
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  photo_url: string | null;
  is_premium: boolean;
  created_at: string; // ISO date string
}

const mockUserProfile: UserProfile = {
  id: 'mockUser123',
  name: 'Usuário de Demonstração',
  email: 'demo@estude.plus',
  photo_url: 'https://placehold.co/150x150.png?text=Demo',
  is_premium: true,
  created_at: new Date().toISOString(),
};

const mockSavedCourses: Course[] = [
  { id: '1', title: 'Cálculo Avançado (Mock)', description: 'Domine os fundamentos do cálculo avançado.', modules: 12, difficulty: 'Avançado', category: 'Matemática', image: 'https://placehold.co/600x400.png', dataAiHint: 'calculus graph' },
  { id: '4', title: 'Python para Ciência de Dados (Mock)', description: 'Aprenda programação Python para análise de dados.', modules: 15, difficulty: 'Intermediário', category: 'Programação', image: 'https://placehold.co/600x400.png', dataAiHint: 'data visualization' },
];

const mockStudyHistory = [
  { course: 'Introdução à Álgebra (Mock)', status: 'Concluído', date: '20/05/2023' },
  { course: 'Fundamentos de Física (Mock)', status: 'Concluído', date: '10/08/2023' },
  { course: 'Cálculo I (Mock)', status: 'Em Progresso (70%)', date: 'Em andamento' },
];

const mockUserStats = {
  overallProgress: 65, 
  coursesCompleted: 2, // Ajustado para corresponder ao mockStudyHistory
  modulesStudied: 42,
};
const defaultPhotoUrl = 'https://placehold.co/150x150.png?text=User';

export default function ProfilePage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  
  const [editableName, setEditableName] = useState('');
  const [editablePhotoUrl, setEditablePhotoUrl] = useState('');

  useEffect(() => {
    setIsLoading(true);
    // Simula o carregamento de dados do perfil
    setTimeout(() => {
      setProfile(mockUserProfile);
      setEditableName(mockUserProfile.name || '');
      setEditablePhotoUrl(mockUserProfile.photo_url || defaultPhotoUrl);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setIsLoadingSave(true);
    
    // Simula o salvamento dos dados
    await new Promise(resolve => setTimeout(resolve, 1000));

    setProfile(prevProfile => ({
      ...(prevProfile as UserProfile),
      name: editableName,
      photo_url: editablePhotoUrl,
    }));
    
    toast({ title: "Perfil (Mock) Atualizado", description: "Suas informações foram atualizadas localmente (sem backend)." });
    setIsEditing(false);
    setIsLoadingSave(false);
  };

  const handleCancelEdit = () => {
    if (profile) {
      setEditableName(profile.name || '');
      setEditablePhotoUrl(profile.photo_url || defaultPhotoUrl);
    }
    setIsEditing(false);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Carregando perfil...</p>
      </div>
    );
  }
  
  if (!profile) { 
    return <div className="text-center text-muted-foreground py-8 text-lg">Perfil não pôde ser carregado (mock).</div>;
  }

  const initials = profile.name ? profile.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : (profile.email ? profile.email[0].toUpperCase() : 'U');
  const joinDate = profile.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric'}) : 'Data indisponível';

  return (
    <div className="space-y-8">
      <Card className="shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-accent p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src={profile.photo_url || defaultPhotoUrl} alt={profile.name || 'Usuário'} data-ai-hint="profile picture user" />
              <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-primary-foreground font-headline">{profile.name || 'Nome não definido'}</h1>
              <p className="text-lg text-primary-foreground/80">{profile.email || 'Email não disponível'}</p>
              {profile.is_premium && (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-background/20 px-3 py-1 text-xs font-semibold text-primary-foreground">
                  <ShieldCheck className="h-4 w-4" /> Membro Premium
                </span>
              )}
            </div>
            <Button variant="outline" size="lg" className="md:ml-auto bg-background/20 text-primary-foreground hover:bg-background/30 border-primary-foreground/50" onClick={() => setIsEditing(!isEditing)} disabled={isLoadingSave}>
              <Edit3 className="mr-2 h-5 w-5" /> {isEditing ? 'Cancelar Edição' : 'Editar Perfil'}
            </Button>
          </div>
        </div>
        
        {isEditing && (
          <CardContent className="p-6 bg-card">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
              <div>
                <Label htmlFor="editableName" className="text-base">Nome Completo</Label>
                <Input id="editableName" value={editableName} onChange={(e) => setEditableName(e.target.value)} className="mt-1 text-base h-12" disabled={isLoadingSave}/>
              </div>
              <div>
                <Label htmlFor="profileEmail" className="text-base">Endereço de Email (não editável)</Label>
                <Input id="profileEmail" type="email" value={profile.email || ''} className="mt-1 text-base h-12 bg-muted cursor-not-allowed" disabled readOnly/>
              </div>
               <div>
                <Label htmlFor="editablePhotoUrl" className="text-base">URL da Foto</Label>
                <Input id="editablePhotoUrl" type="text" value={editablePhotoUrl} onChange={(e) => setEditablePhotoUrl(e.target.value)} className="mt-1 text-base h-12" disabled={isLoadingSave}/>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleCancelEdit} className="text-base px-6 py-3" disabled={isLoadingSave}>Cancelar</Button>
                <Button type="submit" className="text-base px-6 py-3 bg-primary hover:bg-primary/90" disabled={isLoadingSave}>
                  {isLoadingSave ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Progresso Geral</CardTitle>
            <BarChart3 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">{mockUserStats.overallProgress}%</div>
            <Progress value={mockUserStats.overallProgress} className="mt-2 h-3" />
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Cursos Concluídos</CardTitle>
            <CheckCircle className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">{mockUserStats.coursesCompleted}</div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Data de Ingresso</CardTitle>
            <CalendarDays className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold font-headline">{joinDate}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="saved_courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-2 h-14 text-base">
          <TabsTrigger value="saved_courses" className="py-3 text-base">Meus Cursos Salvos</TabsTrigger>
          <TabsTrigger value="study_history" className="py-3 text-base">Histórico de Estudos</TabsTrigger>
        </TabsList>
        <TabsContent value="saved_courses" className="mt-6">
          {mockSavedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockSavedCourses.map(course => <CourseCard key={course.id} course={course} />)}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Você ainda não salvou nenhum curso.</p>
          )}
        </TabsContent>
        <TabsContent value="study_history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Sua Jornada de Aprendizagem</CardTitle>
              <CardDescription>Acompanhe seu progresso em todos os cursos.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {mockStudyHistory.map((item, index) => (
                  <li key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">{item.course}</h3>
                      <span className={`text-sm px-2 py-0.5 rounded-full ${item.status.includes('Concluído') ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : item.status.includes('Progresso') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Última atividade: {item.date}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
