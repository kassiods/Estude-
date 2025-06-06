
// src/app/(app)/courses/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Filter, Search, BookOpen, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { type Level } from '@prisma/client';

interface CourseItem {
  id: string;
  title: string;
  description: string | null;
  level: Level;
  imageUrl: string | null;
  modulesCount: number;
}

function CourseItemCard({ course }: { course: CourseItem }) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
      <Link href={`/courses/${course.id}`} passHref className="flex flex-col h-full">
        <CardHeader className="p-0 relative">
          <Image 
            src={course.imageUrl || `https://placehold.co/600x400.png?text=${encodeURIComponent(course.title)}`} 
            alt={course.title} 
            width={600} 
            height={300} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
            data-ai-hint="course education"
          />
        </CardHeader>
        <CardContent className="p-4 md:p-6 flex-grow">
          <CardTitle className="text-lg md:text-xl mb-1 font-headline group-hover:text-primary transition-colors">{course.title}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground mb-2 capitalize">{course.level.toLowerCase()}</CardDescription>
          <CardDescription className="text-sm text-muted-foreground mb-3 h-16 overflow-hidden text-ellipsis line-clamp-3">
            {course.description || "Nenhuma descrição disponível."}
          </CardDescription>
          <div className="text-xs text-muted-foreground mt-auto">
            <span>{course.modulesCount} módulos</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 md:p-6 pt-0">
            <Button variant="outline" className="w-full mt-2">
              Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}

function CoursesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [levelFilter, setLevelFilter] = useState(searchParams.get('level') || 'all');

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setLevelFilter(searchParams.get('level') || 'all');
  }, [searchParams]);

  useEffect(() => {
    async function fetchCourses() {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append('search', searchTerm);
        if (levelFilter !== 'all') queryParams.append('level', levelFilter);
        
        const mockData: CourseItem[] = [
            { id: 'clxwg9z960002118z3f9qkvvb', title: 'Next.js Avançado com App Router', description: 'Domine o Next.js moderno, Server Components, e construa aplicações robustas.', level: 'ADVANCED', imageUrl: 'https://placehold.co/600x400.png?text=Next.js+Avançado', modulesCount: 5 },
            { id: 'clxwg9z9t0006118z6z9wlvg0', title: 'Prisma ORM Essencial', description: 'Aprenda a modelar seu banco de dados e realizar queries com Prisma.', level: 'INTERMEDIATE', imageUrl: 'https://placehold.co/600x400.png?text=Prisma+Essencial', modulesCount: 3 },
            { id: 'c3', title: 'Introdução à Programação Python', description: 'Conceitos básicos de Python para iniciantes.', level: 'BEGINNER', imageUrl: 'https://placehold.co/600x400.png?text=Python+Básico', modulesCount: 8 },
            { id: 'c4', title: 'Algoritmos e Estruturas de Dados', description: 'Fundamentos essenciais para todo desenvolvedor.', level: 'INTERMEDIATE', imageUrl: 'https://placehold.co/600x400.png?text=Algoritmos', modulesCount: 10 },
        ];
        
        let filteredMockData = mockData;
        if (searchTerm) {
            filteredMockData = filteredMockData.filter(course => 
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        if (levelFilter !== 'all') {
            filteredMockData = filteredMockData.filter(course => course.level.toLowerCase() === levelFilter.toLowerCase());
        }
        setCourses(filteredMockData);

      } catch (err) {
        setError((err as Error).message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCourses();
  }, [searchTerm, levelFilter]);

  const handleFilterChange = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) params.set('search', searchTerm); else params.delete('search');
    if (levelFilter !== 'all') params.set('level', levelFilter); else params.delete('level');
    router.push(`/courses?${params.toString()}`, { scroll: false });
  };
  
  const levels: { value: string, label: string }[] = [
    { value: 'all', label: 'Todos os Níveis' },
    { value: 'BEGINNER', label: 'Iniciante' },
    { value: 'INTERMEDIATE', label: 'Intermediário' },
    { value: 'ADVANCED', label: 'Avançado' },
  ];


  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center font-headline">
            <BookOpen className="mr-3 h-8 w-8 text-primary" /> Explorar Cursos
          </CardTitle>
          <CardDescription>Encontre o curso perfeito para expandir seu conhecimento.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por título ou descrição..."
              className="w-full rounded-lg pl-10 h-12 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterChange()}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label htmlFor="level-filter" className="block text-sm font-medium text-muted-foreground mb-1">Nível</label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger id="level-filter" className="h-12 text-base">
                  <SelectValue placeholder="Filtrar por nível" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(lvl => (
                    <SelectItem key={lvl.value} value={lvl.value} className="capitalize text-base">{lvl.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleFilterChange} className="w-full md:w-auto h-12 text-base" disabled={isLoading}>
              <Filter className="mr-2 h-5 w-5" /> 
              {isLoading ? <Loader2 className="animate-spin"/> : "Aplicar Filtros"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">Carregando cursos...</p>
        </div>
      )}
      {error && (
         <Card className="bg-destructive/10 border-destructive">
            <CardContent className="p-6 text-center text-destructive">
                <p>Erro ao carregar cursos: {error}</p>
            </CardContent>
         </Card>
      )}
      {!isLoading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => <CourseItemCard key={course.id} course={course} />)}
        </div>
      )}
      {!isLoading && !error && courses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">Nenhum curso encontrado.</p>
          <p className="text-sm text-muted-foreground mt-1">Tente ajustar seus filtros ou buscar por outro termo.</p>
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <CoursesPageContent />
    </Suspense>
  );
}
