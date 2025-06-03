"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: number;
  difficulty: string;
  category?: string;
  image: string;
  dataAiHint?: string;
}

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Image 
          src={course.image} 
          alt={course.title} 
          width={600} 
          height={300} 
          className="w-full h-48 object-cover" 
          data-ai-hint={course.dataAiHint || "course study"}
        />
        {course.category && (
          <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded-md">
            {course.category}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl mb-2 font-headline">{course.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-4 h-20 overflow-hidden text-ellipsis">
          {course.description}
        </CardDescription>
        <div className="text-xs text-muted-foreground">
          <span>{course.modules} modules</span> | <span className="capitalize">{course.difficulty}</span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link href={`/courses/${course.id}`} passHref className="w-full">
          <Button variant="outline" className="w-full">
            Explore Course <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
