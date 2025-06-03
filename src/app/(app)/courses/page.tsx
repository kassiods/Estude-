"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Filter, Search, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const mockCoursesData = [
  { id: '1', title: 'Advanced Calculus', description: 'Master the fundamentals of advanced calculus.', modules: 12, difficulty: 'Advanced', category: 'Mathematics', image: 'https://placehold.co/600x400.png', dataAiHint: 'math equation' },
  { id: '2', title: 'Organic Chemistry Basics', description: 'An introduction to organic chemistry.', modules: 10, difficulty: 'Intermediate', category: 'Science', image: 'https://placehold.co/600x400.png', dataAiHint: 'chemistry molecules' },
  { id: '3', title: 'World History: Ancient Civilizations', description: 'Explore the dawn of human civilization.', modules: 8, difficulty: 'Beginner', category: 'Humanities', image: 'https://placehold.co/600x400.png', dataAiHint: 'ancient ruins' },
  { id: '4', title: 'Python for Data Science', description: 'Learn Python programming for data analysis.', modules: 15, difficulty: 'Intermediate', category: 'Programming', image: 'https://placehold.co/600x400.png', dataAiHint: 'python code' },
  { id: '5', title: 'Introduction to Economics', description: 'Understand basic economic principles.', modules: 9, difficulty: 'Beginner', category: 'Social Sciences', image: 'https://placehold.co/600x400.png', dataAiHint: 'stock chart' },
  { id: '6', title: 'Modern Art History', description: 'A survey of art from the 19th century to present.', modules: 11, difficulty: 'Intermediate', category: 'Arts', image: 'https://placehold.co/600x400.png', dataAiHint: 'art gallery' },
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

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredCourses = mockCoursesData.filter(course => {
    return (
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (difficultyFilter === 'all' || course.difficulty.toLowerCase() === difficultyFilter) &&
      (categoryFilter === 'all' || course.category === categoryFilter)
    );
  });

  const categories = ['all', ...new Set(mockCoursesData.map(c => c.category))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center font-headline">
            <BookOpen className="mr-3 h-8 w-8 text-primary" /> Explore Courses
          </CardTitle>
          <CardDescription>Find the perfect course to expand your knowledge.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="w-full rounded-lg pl-10 h-12 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category-filter" className="h-12 text-base">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="capitalize text-base">{cat === 'all' ? 'All Categories' : cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="difficulty-filter" className="block text-sm font-medium text-muted-foreground mb-1">Difficulty</label>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger id="difficulty-filter" className="h-12 text-base">
                  <SelectValue placeholder="Filter by difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(diff => (
                    <SelectItem key={diff} value={diff} className="capitalize text-base">{diff === 'all' ? 'All Difficulties' : diff}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="md:self-end h-12 text-base">
              <Filter className="mr-2 h-5 w-5" /> Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => <CourseItemCard key={course.id} course={course} />)}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No courses found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
