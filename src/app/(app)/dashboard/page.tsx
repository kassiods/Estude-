// src/app/(app)/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, BookOpen, Search, Sparkles, TrendingUp, Lightbulb, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Corrected: import useRouter from next/navigation
// For a real app, fetch courses from your API: /api/courses
// import { type Course } from '@prisma/client'; // If you share types

interface CourseSummary {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  category?: string; // Added category for display
  dataAiHint?: string;
}

interface UserProgressSummary {
  courseId: string;
  progressPercentage: number;
}

// Mock Data - Replace with API calls
const mockCourses: CourseSummary[] = [
  { id: 'clxwg9z960002118z3f9qkvvb', title: 'Next.js Avançado com App Router', description: 'Domine o Next.js moderno e construa aplicações robustas.', imageUrl: 'https://placehold.co/600x400.png?text=Next.js', category: 'Desenvolvimento Web', dataAiHint: 'code laptop' },
  { id: 'clxwg9z9t0006118z6z9wlvg0', title: 'Prisma ORM Essencial', description: 'Aprenda a modelar seu banco de dados e realizar queries.', imageUrl: 'https://placehold.co/600x400.png?text=Prisma', category: 'Banco de Dados', dataAiHint: 'database icon' },
  { id: '3', title: 'Design de UI/UX para Iniciantes', description: 'Princípios fundamentais de design e experiência do usuário.', imageUrl: 'https://placehold.co/600x400.png?text=UI/UX', category: 'Design', dataAiHint: 'design tools' },
];

const mockUserProgress: UserProgressSummary[] = [
  { courseId: 'clxwg9z960002118z3f9qkvvb', progressPercentage: 75 },
  { courseId: 'clxwg9z9t0006118z6z9wlvg0', progressPercentage: 30 },
];


function CourseCard({ course, progress }: { course: CourseSummary; progress?: UserProgressSummary }) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
      <Link href={`/courses/${course.id}`} passHref className="flex flex-col h-full">
        <CardHeader className="p-0 relative">
          <Image 
            src={course.imageUrl || 'https://placehold.co/600x400.png?text=Curso'} 
            alt={course.title} 
            width={600} 
            height={300} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={course.dataAiHint || "study learning"}
          />
          {course.category && (
            <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded-md backdrop-blur-sm">
              {course.category}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 md:p-6 flex-grow">
          <CardTitle className="text-lg md:text-xl mb-2 font-headline group-hover:text-primary transition-colors">{course.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mb-3 text-ellipsis line-clamp-3">{course.description}</CardDescription>
          {progress && (
            <div className="mt-auto">
              <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                <span>Progresso</span>
                <span>{progress.progressPercentage}%</span>
              </div>
              <Progress value={progress.progressPercentage} className="h-2" />
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 md:p-6 pt-0">
            <Button variant="outline" className="w-full mt-2">
              Continuar Aprendendo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}


export default function DashboardPage() {
  const [searchTermDashboard, setSearchTermDashboard] = useState('');
  const router = useRouter(); 

  // In a real app, fetch this data from your API
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgressSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls
    setIsLoading(true);
    setTimeout(() => {
      setCourses(mockCourses);
      setUserProgress(mockUserProgress);
      setIsLoading(false);
    }, 500); // Simulate network delay
  }, []);

  const handleDashboardSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTermDashboard.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchTermDashboard.trim())}`);
    }
  };
  
  const getProgressForCourse = (courseId: string) => {
    return userProgress.find(p => p.courseId === courseId);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8 bg-card rounded-xl shadow-md animate-pulse">
          <div className="h-10 bg-muted rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-6 bg-muted rounded w-1/2 mx-auto mb-8"></div>
          <div className="max-w-2xl mx-auto">
            <div className="h-16 bg-muted rounded-full w-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg"></div>
              <CardContent className="p-6 space-y-3">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="h-2 bg-primary/30 rounded-full mt-4"></div>
              </CardContent>
              <CardFooter className="p-6">
                 <div className="h-10 bg-muted rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-card rounded-xl shadow-md">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 font-headline text-gray-800 dark:text-gray-100">Bem-vindo ao Estude+</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">Sua jornada para o sucesso acadêmico começa aqui. Encontre cursos e organize seus estudos.</p>
        <div className="max-w-2xl mx-auto px-4">
          <form onSubmit={handleDashboardSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="O que você quer aprender hoje?"
              className="w-full rounded-full h-14 pl-12 pr-6 text-md shadow-inner border-border focus:ring-primary focus:border-primary"
              value={searchTermDashboard}
              onChange={(e) => setSearchTermDashboard(e.target.value)}
            />
            <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full">
                <ArrowRight className="h-5 w-5"/>
            </Button>
          </form>
        </div>
      </section>

      {/* Placeholder for Personalized Recommendations if AI features are built */}
      {/* <PersonalizedRecommendationsSection /> */}

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold flex items-center font-headline">
            <TrendingUp className="mr-3 h-7 w-7 text-primary" /> Meus Cursos
          </h2>
          <Button variant="outline" asChild>
            <Link href="/courses">Ver Todos os Cursos</Link>
          </Button>
        </div>
        {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0,3).map(course => (
                <CourseCard key={course.id} course={course} progress={getProgressForCourse(course.id)} />
            ))}
            </div>
        ) : (
            <Card>
                <CardContent className="p-10 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
                    <p className="text-lg text-muted-foreground">Nenhum curso encontrado.</p>
                    <Button asChild className="mt-4">
                        <Link href="/courses">Explorar Cursos</Link>
                    </Button>
                </CardContent>
            </Card>
        )}
      </section>
      
      {/* Placeholder for AI Study Tip if AI features are built */}
      {/* <AiStudyTipSection /> */}
      
    </div>
  );
}
