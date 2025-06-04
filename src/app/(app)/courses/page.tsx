
"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Filter, Search, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const mockCoursesData = [
  { id: '1', title: 'Cálculo Avançado', description: 'Domine os fundamentos do cálculo avançado.', modules: 12, difficulty: 'Avançado', category: 'Matemática', image: 'https://placehold.co/600x400.png', dataAiHint: 'math equation' },
  { id: '2', title: 'Química Orgânica Básica', description: 'Uma introdução à química orgânica.', modules: 10, difficulty: 'Intermediário', category: 'Ciências', image: 'https://placehold.co/600x400.png', dataAiHint: 'chemistry molecules' },
  { id: '3', title: 'História Mundial: Civilizações Antigas', description: 'Explore o alvorecer da civilização humana.', modules: 8, difficulty: 'Iniciante', category: 'Humanidades', image: 'https://placehold.co/600x400.png', dataAiHint: 'ancient ruins' },
  { id: '4', title: 'Python para Ciência de Dados', description: 'Aprenda programação Python para análise de dados.', modules: 15, difficulty: 'Intermediário', category: 'Programação', image: 'https://placehold.co/600x400.png', dataAiHint: 'python code' },
  { id: '5', title: 'Introdução à Economia', description: 'Entenda os princípios econômicos básicos.', modules: 9, difficulty: 'Iniciante', category: 'Ciências Sociais', image: 'https://placehold.co/600x400.png', dataAiHint: 'stock chart' },
  { id: '6', title: 'História da Arte Moderna', description: 'Um panorama da arte do século XIX até o presente.', modules: 11, difficulty: 'Intermediário', category: 'Artes', image: 'https://placehold.co/600x400.png', dataAiHint: 'art gallery' },
];

type Course = typeof mockCoursesData[0];

function CourseItemCard({ course }: { course: Course }) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Image src={course.image} alt={course.title} width={600} height={300} className="w-full h-48 object-cover" data-ai-hint={course.dataAiHint}/>
        <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded-md">{course.category}</div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl mb-2 font-headline">{course.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-4 h-20 overflow-hidden text-ellipsis">{course.description}</CardDescription>
        <div className="text-xs text-muted-foreground">
          <span>{course.modules} módulos</span> | <span className="capitalize">{course.difficulty}</span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link href={`/courses/${course.id}`} passHref className="w-full">
          <Button variant="outline" className="w-full">
            Explorar Curso <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    // Atualiza o estado searchTerm SOMENTE se o parâmetro da URL for diferente do estado atual.
    // Isso evita que o useEffect sobrescreva a digitação do usuário.
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
    // A dependência é apenas 'searchParams' para que o efeito rode quando a URL mudar.
    // Não incluir 'searchTerm' aqui, pois isso causaria o problema de não conseguir apagar.
  }, [searchParams]);


  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD") // Decomposes combined diacritical marks.
      .replace(/[\u0300-\u036f]/g, ""); // Removes diacritical marks.
  };

  const translatedDifficulty = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'advanced': return 'avançado';
      case 'intermediate': return 'intermediário';
      case 'beginner': return 'iniciante';
      default: return difficulty;
    }
  };
  
  const filteredCourses = mockCoursesData.filter(course => {
    const normalizedSearchTerm = normalizeText(searchTerm);
    const normalizedCourseTitle = normalizeText(course.title);
    return (
      normalizedCourseTitle.includes(normalizedSearchTerm) &&
      (difficultyFilter === 'all' || course.difficulty.toLowerCase() === difficultyFilter) &&
      (categoryFilter === 'all' || course.category === categoryFilter)
    );
  });

  const categories = ['all', ...new Set(mockCoursesData.map(c => c.category))];
  const difficulties = ['all', 'iniciante', 'intermediário', 'avançado'];
  const displayDifficulties = {
    'all': 'Todas as Dificuldades',
    'iniciante': 'Iniciante',
    'intermediário': 'Intermediário',
    'avançado': 'Avançado'
  };


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
              placeholder="Buscar cursos..."
              className="w-full rounded-lg pl-10 h-12 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-muted-foreground mb-1">Categoria</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category-filter" className="h-12 text-base">
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="capitalize text-base">{cat === 'all' ? 'Todas as Categorias' : cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="difficulty-filter" className="block text-sm font-medium text-muted-foreground mb-1">Dificuldade</label>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger id="difficulty-filter" className="h-12 text-base">
                  <SelectValue placeholder="Filtrar por dificuldade" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(diffKey => (
                    <SelectItem key={diffKey} value={diffKey} className="capitalize text-base">
                      {displayDifficulties[diffKey as keyof typeof displayDifficulties]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="md:self-end h-12 text-base">
              <Filter className="mr-2 h-5 w-5" /> Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => <CourseItemCard key={course.id} course={{...course, difficulty: translatedDifficulty(course.difficulty)}} />)}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">Nenhum curso encontrado com seus critérios.</p>
          {initialSearchTerm && <p className="text-md text-muted-foreground mt-2">Termo buscado: "{initialSearchTerm}"</p>}
        </div>
      )}
    </div>
  );
}
