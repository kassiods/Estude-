
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, BookOpen, Search, Sparkles, TrendingUp, CalendarDays, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getPersonalizedRecommendations, PersonalizedRecommendationsInput, PersonalizedRecommendationsOutput } from '@/ai/flows/personalized-recommendations';
import { generateStudyTip, GenerateStudyTipInput, GenerateStudyTipOutput } from '@/ai/flows/ai-powered-highlights';

// Mock data
const mockCourses = [
  { id: '1', title: 'Cálculo Avançado', description: 'Domine os fundamentos do cálculo avançado.', modules: 12, difficulty: 'Avançado', image: 'https://placehold.co/600x400.png', dataAiHint: 'math textbook' },
  { id: '2', title: 'Química Orgânica Básica', description: 'Uma introdução à química orgânica.', modules: 10, difficulty: 'Intermediário', image: 'https://placehold.co/600x400.png', dataAiHint: 'chemistry lab' },
  { id: '3', title: 'História Mundial: Civilizações Antigas', description: 'Explore o alvorecer da civilização humana.', modules: 8, difficulty: 'Iniciante', image: 'https://placehold.co/600x400.png', dataAiHint: 'historical map' },
  { id: '4', title: 'Python para Ciência de Dados', description: 'Aprenda programação Python para análise de dados.', modules: 15, difficulty: 'Intermediário', image: 'https://placehold.co/600x400.png', dataAiHint: 'code screen' },
];

const mockExams = [
  { id: '1', title: 'ENEM 2024', summary: 'Exame Nacional do Ensino Médio, inscrições abertas até 30/07.', link: '#' },
  { id: '2', title: 'Vestibular FUVEST 2025', summary: 'Exame de ingresso da Universidade de São Paulo. Confira o edital oficial.', link: '#' },
];

function CourseCard({ course }: { course: typeof mockCourses[0] }) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0">
        <Image src={course.image} alt={course.title} width={600} height={300} className="w-full h-48 object-cover" data-ai-hint={course.dataAiHint}/>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl mb-2 font-headline">{course.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-4">{course.description}</CardDescription>
        <div className="text-xs text-muted-foreground">
          <span>{course.modules} módulos</span> | <span>{course.difficulty}</span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link href={`/courses/${course.id}`} passHref className="w-full">
          <Button variant="outline" className="w-full">
            Ver Curso <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function PersonalizedRecommendationsSection() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      setIsLoading(true);
      try {
        const input: PersonalizedRecommendationsInput = {
          studyHistory: "Concluído: Introdução à Álgebra, Fundamentos de Física. Em progresso: Cálculo I.",
          userPreferences: "Interessado em engenharia e ciência da computação.",
          numberOfRecommendations: 3,
        };
        const result: PersonalizedRecommendationsOutput = await getPersonalizedRecommendations(input);
        setRecommendations(result.recommendations);
      } catch (error) {
        console.error("Falha ao buscar recomendações:", error);
        setRecommendations(["Não foi possível carregar as recomendações."]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecommendations();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <Sparkles className="mr-2 h-6 w-6 text-primary" /> Recomendado para Você
        </CardTitle>
        <CardDescription>Cursos adaptados ao seu caminho de aprendizado.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Carregando recomendações...</p>
        ) : (
          <ul className="space-y-3">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-center p-3 bg-secondary/50 rounded-md hover:bg-secondary transition-colors">
                <BookOpen className="h-5 w-5 mr-3 text-primary" />
                <span className="text-base">{rec}</span>
                {/* Potential: Link to course page if title matches a known course */}
                <Button variant="ghost" size="sm" className="ml-auto">Ver</Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function AiStudyTipSection() {
  const [tip, setTip] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStudyTip() {
      setIsLoading(true);
      try {
        const input: GenerateStudyTipInput = { topic: "Estratégias Eficazes de Aprendizagem" }; 
        const result: GenerateStudyTipOutput = await generateStudyTip(input);
        setTip(result.tip);
      } catch (error) {
        console.error("Falha ao buscar dica de estudo:", error);
        setTip("Não foi possível carregar a dica de estudo no momento.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchStudyTip();
  }, []);

  return (
    <Card className="bg-gradient-to-br from-accent/80 to-primary/80 text-accent-foreground shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <Lightbulb className="mr-2 h-6 w-6" /> Dica de Estudo AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? <p>Carregando dica...</p> : <p className="text-lg">{tip}</p>}
      </CardContent>
    </Card>
  );
}


export default function DashboardPage() {
  const router = useRouter();
  const [searchTermDashboard, setSearchTermDashboard] = useState('');

  const handleDashboardSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTermDashboard.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchTermDashboard.trim())}`);
    }
  };

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-card rounded-xl shadow-md">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-headline">bem vindo ao estude +</h1>
        <p className="text-xl text-muted-foreground mb-8">Sua jornada para o sucesso acadêmico começa aqui.</p>
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleDashboardSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
              <Input
                type="search"
                placeholder="O que você quer aprender hoje?"
                className="w-full rounded-full h-16 pl-14 pr-6 text-lg shadow-inner"
                value={searchTermDashboard}
                onChange={(e) => setSearchTermDashboard(e.target.value)}
              />
            </div>
          </form>
        </div>
      </section>

      <PersonalizedRecommendationsSection />

      <section>
        <h2 className="text-3xl font-semibold mb-6 flex items-center font-headline">
          <TrendingUp className="mr-3 h-8 w-8 text-primary" /> Cursos Populares
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockCourses.slice(0,4).map(course => <CourseCard key={course.id} course={course} />)}
        </div>
      </section>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-headline">
                <CalendarDays className="mr-2 h-6 w-6 text-primary" /> Provas e Prazos Atuais
              </CardTitle>
              <CardDescription>Mantenha-se atualizado com eventos acadêmicos importantes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockExams.map(exam => (
                <div key={exam.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-lg text-primary">{exam.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{exam.summary}</p>
                  <Link href={exam.link} target="_blank" rel="noopener noreferrer">
                    <Button variant="link" className="p-0 h-auto mt-2 text-sm">
                      Saiba Mais <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <AiStudyTipSection />
        </div>
      </div>

    </div>
  );
}
