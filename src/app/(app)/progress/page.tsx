// src/app/(app)/progress/page.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, ListChecks, Target, CheckCircle } from 'lucide-react';

const mockOverallProgress = {
  coursesInProgress: 2,
  coursesCompleted: 4,
  overallPercentage: 68,
};

const mockCourseProgress = [
  { id: '1', title: 'Next.js Avançado com App Router', progress: 75, description: "Dominando o Next.js moderno." },
  { id: '2', title: 'Prisma ORM Essencial', progress: 45, description: "Modelagem e queries de banco de dados."},
  { id: '3', title: 'Introdução à Programação Python', progress: 95, description: "Conceitos básicos de Python."},
];

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center font-headline">
            <BarChart3 className="mr-3 h-8 w-8 text-primary" /> Meu Progresso
          </CardTitle>
          <CardDescription>Acompanhe sua jornada de aprendizado e veja suas conquistas.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Progresso Geral</CardTitle>
            <Target className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">{mockOverallProgress.overallPercentage}%</div>
            <Progress value={mockOverallProgress.overallPercentage} className="mt-2 h-3" />
            <p className="text-xs text-muted-foreground mt-1">Concluído em todos os cursos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Cursos em Andamento</CardTitle>
            <ListChecks className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">{mockOverallProgress.coursesInProgress}</div>
            <p className="text-xs text-muted-foreground mt-1">Continue aprendendo!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Cursos Concluídos</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">{mockOverallProgress.coursesCompleted}</div>
             <p className="text-xs text-muted-foreground mt-1">Parabéns pela dedicação!</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold font-headline">Progresso Detalhado por Curso</CardTitle>
          <CardDescription>Veja o quanto você avançou em cada um dos seus cursos ativos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {mockCourseProgress.map(course => (
            <div key={course.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow bg-card">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{course.title}</h3>
                <span className="text-sm font-bold text-primary">{course.progress}%</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{course.description}</p>
              <Progress value={course.progress} className="h-2.5" />
            </div>
          ))}
          <p className="text-center text-sm text-muted-foreground pt-4">
            Os dados de progresso exibidos aqui são apenas para fins demonstrativos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
