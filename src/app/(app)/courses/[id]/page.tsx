
// src/app/(app)/courses/[id]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, CheckCircle, PlayCircle, FileText, HelpCircle, Loader2, AlertTriangle, ArrowLeft, BookOpen } from 'lucide-react';
import { type Level, type ContentType } from '@prisma/client';
import { useToast } from '@/components/ui/use-toast';

interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  order: number;
  url?: string | null;
  textContent?: string | null;
  isCompleted?: boolean;
}

interface ModuleItem {
  id: string;
  title: string;
  description: string | null;
  order: number;
  contents: ContentItem[];
}

interface CourseDetails {
  id: string;
  title: string;
  description: string | null;
  level: Level;
  imageUrl: string | null;
  modules: ModuleItem[];
  isFavorite?: boolean;
}

const mockCourseDetails: CourseDetails = {
    id: 'clxwg9z960002118z3f9qkvvb',
    title: 'Next.js Avançado com App Router',
    description: 'Domine o Next.js moderno, Server Components, Server Actions, estratégias de cache avançadas e construa aplicações web full-stack robustas e performáticas.',
    level: 'ADVANCED',
    imageUrl: 'https://placehold.co/1200x600.png?text=Next.js+Detalhes',
    isFavorite: false,
    modules: [
      {
        id: 'm1',
        title: 'Introdução ao App Router',
        description: 'Entendendo a nova arquitetura e seus componentes chave.',
        order: 1,
        contents: [
          { id: 'c1', title: 'Visão Geral do App Router', type: 'VIDEO', order: 1, url: '#video1', isCompleted: true },
          { id: 'c2', title: 'Server Components vs Client Components', type: 'TEXT', order: 2, textContent: 'Uma exploração detalhada das diferenças e usos...', isCompleted: false },
          { id: 'c3', title: 'Layouts e Templates', type: 'VIDEO', order: 3, url: '#video2', isCompleted: false },
        ],
      },
      {
        id: 'm2',
        title: 'Data Fetching e Mutações',
        description: 'Server Actions, caching e revalidação de dados.',
        order: 2,
        contents: [
          { id: 'c4', title: 'Usando Server Actions para Mutações', type: 'VIDEO', order: 1, url: '#video3', isCompleted: false },
          { id: 'c5', title: 'Estratégias de Cache com fetch', type: 'TEXT', order: 2, textContent: 'Controlando o cache no servidor e cliente...', isCompleted: false },
          { id: 'c6', title: 'Quiz: Data Fetching', type: 'QUIZ', order: 3, textContent: 'Pergunta 1: O que é revalidateTag?', isCompleted: false },
        ],
      },
       {
        id: 'm3',
        title: 'Tópicos Avançados',
        description: 'Rotas paralelas, interceptação e deploy.',
        order: 3,
        contents: [
          { id: 'c7', title: 'Rotas Paralelas e Interceptadas', type: 'VIDEO', order: 1, url: '#video4', isCompleted: false },
        ],
      },
    ],
};

const ContentIcon = ({ type }: { type: ContentType }) => {
  switch (type) {
    case 'VIDEO': return <PlayCircle className="h-5 w-5 text-primary" />;
    case 'TEXT': return <FileText className="h-5 w-5 text-indigo-500" />;
    case 'QUIZ': return <HelpCircle className="h-5 w-5 text-green-500" />;
    default: return <FileText className="h-5 w-5 text-muted-foreground" />;
  }
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (courseId) {
      const fetchCourseDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Simulate API call with mock data
          await new Promise(resolve => setTimeout(resolve, 500));
          if (courseId === mockCourseDetails.id) {
            setCourse(mockCourseDetails);
            setIsFavorite(mockCourseDetails.isFavorite || false);
          } else {
            throw new Error('Curso não encontrado.');
          }

        } catch (err) {
          setError((err as Error).message);
          console.error("Error fetching course details:", err);
          toast({ title: "Erro", description: (err as Error).message, variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };
      fetchCourseDetails();
    }
  }, [courseId, toast]);

  const toggleFavorite = async () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus); 
    try {
      toast({
        title: newFavoriteStatus ? "Adicionado aos Favoritos" : "Removido dos Favoritos",
        description: `Curso "${course?.title}" ${newFavoriteStatus ? 'adicionado aos' : 'removido dos'} seus favoritos. (Simulado)`,
      });
    } catch (err) {
      toast({ title: "Erro", description: (err as Error).message, variant: "destructive" });
    }
  };

  const markContentAsCompleted = (moduleId: string, contentId: string) => {
    setCourse(prevCourse => {
      if (!prevCourse) return null;
      return {
        ...prevCourse,
        modules: prevCourse.modules.map(module => 
          module.id === moduleId 
          ? {
              ...module,
              contents: module.contents.map(content => 
                content.id === contentId ? { ...content, isCompleted: true } : content
              )
            }
          : module
        )
      };
    });
    toast({ title: "Progresso Salvo!", description: "Conteúdo marcado como concluído. (Simulado)" });
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Erro ao Carregar Curso</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => router.push('/courses')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Cursos
        </Button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center">
        <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Curso não encontrado</h2>
        <p className="text-muted-foreground mb-6">O curso que você está procurando não existe ou foi movido.</p>
        <Button onClick={() => router.push('/courses')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Cursos
        </Button>
      </div>
    );
  }
  
  const totalContents = course.modules.reduce((sum, module) => sum + module.contents.length, 0);
  const completedContents = course.modules.reduce((sum, module) => 
    sum + module.contents.filter(c => c.isCompleted).length, 0
  );
  const overallProgress = totalContents > 0 ? Math.round((completedContents / totalContents) * 100) : 0;


  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="relative p-0">
          <Image
            src={course.imageUrl || 'https://placehold.co/1200x400.png?text=Estude%2B'}
            alt={course.title}
            width={1200}
            height={400}
            className="w-full h-64 md:h-80 object-cover"
            data-ai-hint="education online course"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
            <Badge variant="secondary" className="mb-2 text-sm capitalize bg-white/20 text-white backdrop-blur-sm">
              {course.level.toLowerCase()}
            </Badge>
            <CardTitle className="text-3xl md:text-4xl font-bold text-white font-headline leading-tight">
              {course.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <CardDescription className="text-base text-muted-foreground md:max-w-3xl">
              {course.description || "Bem-vindo a este curso! Explore os módulos abaixo para começar."}
            </CardDescription>
            <div className="flex-shrink-0 flex items-center gap-3">
                <Button onClick={toggleFavorite} variant="outline" size="lg" className="w-full md:w-auto">
                {isFavorite ? <Heart className="mr-2 h-5 w-5 fill-red-500 text-red-500" /> : <Heart className="mr-2 h-5 w-5" />}
                {isFavorite ? 'Favoritado' : 'Favoritar'}
                </Button>
                <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90">
                   Inscrever-se no Curso
                </Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-medium text-muted-foreground">Seu Progresso</h3>
                <span className="text-sm font-semibold text-primary">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3 w-full" />
          </div>

          <h3 className="text-2xl font-semibold mb-4 font-headline">Módulos do Curso</h3>
          {course.modules.length > 0 ? (
            <Accordion type="single" collapsible defaultValue={course.modules[0]?.id} className="w-full">
              {course.modules.sort((a,b) => a.order - b.order).map((moduleItem) => (
                <AccordionItem key={moduleItem.id} value={moduleItem.id} className="bg-card border rounded-lg mb-3 shadow-sm hover:shadow-md transition-shadow">
                  <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:no-underline data-[state=open]:border-b">
                    <div className="flex items-center gap-3">
                        <span className="text-primary font-bold">Módulo {moduleItem.order}:</span> {moduleItem.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pt-0 pb-4">
                    {moduleItem.description && <p className="text-muted-foreground mb-4 text-sm">{moduleItem.description}</p>}
                    <ul className="space-y-2">
                      {moduleItem.contents.sort((a,b) => a.order - b.order).map((contentItem) => (
                        <li key={contentItem.id} className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors">
                          <Link href={`/courses/${course.id}/modules/${moduleItem.id}/content/${contentItem.id}`} className="flex items-center gap-3 group">
                            <ContentIcon type={contentItem.type} />
                            <span className="group-hover:text-primary transition-colors">{contentItem.title}</span>
                          </Link>
                          <Button 
                            variant={contentItem.isCompleted ? "ghost" : "outline"} 
                            size="sm" 
                            onClick={() => !contentItem.isCompleted && markContentAsCompleted(moduleItem.id, contentItem.id)}
                            disabled={contentItem.isCompleted}
                            className={contentItem.isCompleted ? "text-green-600 hover:text-green-700" : ""}
                          >
                            {contentItem.isCompleted ? <CheckCircle className="mr-2 h-4 w-4" /> : null}
                            {contentItem.isCompleted ? 'Concluído' : 'Marcar como Concluído'}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground">Nenhum módulo disponível para este curso ainda.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
