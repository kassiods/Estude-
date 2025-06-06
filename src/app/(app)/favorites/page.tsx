
// src/app/(app)/favorites/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, BookOpen } from 'lucide-react';

interface FavoriteCourse {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  level: string;
  dataAiHint?: string;
  modulesCount: number;
}

const mockFavoriteCourses: FavoriteCourse[] = [
  { 
    id: 'clxwg9z960002118z3f9qkvvb', 
    title: 'Next.js Avançado com App Router', 
    description: 'Domine o Next.js moderno, Server Components, e construa aplicações robustas.', 
    imageUrl: 'https://placehold.co/600x400.png?text=Next.js+Favorito', 
    category: 'Desenvolvimento Web', 
    level: 'Avançado',
    dataAiHint: 'laptop code',
    modulesCount: 5,
  },
  { 
    id: 'clxwg9z9t0006118z6z9wlvg0', 
    title: 'Prisma ORM Essencial para Desenvolvedores', 
    description: 'Aprenda a modelar seu banco de dados e realizar queries complexas com Prisma.', 
    imageUrl: 'https://placehold.co/600x400.png?text=Prisma+Favorito', 
    category: 'Banco de Dados', 
    level: 'Intermediário',
    dataAiHint: 'database schema',
    modulesCount: 3,
  },
   { 
    id: 'fav_c3', 
    title: 'Design de UI/UX para Produtos Digitais', 
    description: 'Crie interfaces intuitivas e experiências de usuário memoráveis para seus projetos.', 
    imageUrl: 'https://placehold.co/600x400.png?text=UI%2FUX+Favorito', 
    category: 'Design', 
    level: 'Iniciante',
    dataAiHint: 'design sketch',
    modulesCount: 8,
  },
];

function FavoriteCourseCard({ course }: { course: FavoriteCourse }) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
      <Link href={`/courses/${course.id}`} passHref className="flex flex-col h-full">
        <CardHeader className="p-0 relative">
          <Image 
            src={course.imageUrl} 
            alt={course.title} 
            width={600} 
            height={300} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
            data-ai-hint={course.dataAiHint || "education online"}
          />
           <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded-md backdrop-blur-sm">
              {course.category}
            </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6 flex-grow">
          <CardTitle className="text-lg md:text-xl mb-1 font-headline group-hover:text-primary transition-colors">{course.title}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground mb-2 capitalize">{course.level.toLowerCase()}</CardDescription>
          <CardDescription className="text-sm text-muted-foreground mb-3 h-16 overflow-hidden text-ellipsis line-clamp-3">
            {course.description}
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


export default function FavoritesPage() {
  const [favorites, setFavorites] = React.useState(mockFavoriteCourses);

  // Função mock para remover favorito (apenas para demonstração de UI)
  const handleRemoveFavorite = (courseId: string) => {
     // setFavorites(prev => prev.filter(course => course.id !== courseId));
     // console.log(`Simulando remoção do favorito: ${courseId}`);
     // Em uma app real, aqui haveria uma chamada à API
  };


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center font-headline">
            <Heart className="mr-3 h-8 w-8 text-primary fill-primary" /> Meus Favoritos
          </CardTitle>
          <CardDescription>Seus cursos salvos para acesso rápido e aprendizado contínuo.</CardDescription>
        </CardHeader>
      </Card>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(course => (
            <div key={course.id} className="relative">
                <FavoriteCourseCard course={course} />
                {/* 
                // Botão de remover (apenas para demonstração visual, sem lógica real aqui)
                <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-4 right-4 z-10 opacity-70 hover:opacity-100"
                    onClick={() => handleRemoveFavorite(course.id)}
                    title="Remover dos Favoritos (simulado)"
                >
                    <X className="h-4 w-4" />
                </Button> 
                */}
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-10 text-center">
            <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-muted-foreground">Nenhum curso favoritado ainda.</h2>
            <p className="text-muted-foreground mt-2 mb-6">
              Explore nossos cursos e clique no ícone de coração <Heart className="inline h-4 w-4 align-text-bottom"/> para salvá-los aqui!
            </p>
            <Button asChild size="lg">
              <Link href="/courses">Explorar Cursos</Link>
            </Button>
          </CardContent>
        </Card>
      )}
       <p className="text-center text-sm text-muted-foreground pt-4">
        A funcionalidade de favoritar cursos é apenas demonstrativa nesta versão.
      </p>
    </div>
  );
}
