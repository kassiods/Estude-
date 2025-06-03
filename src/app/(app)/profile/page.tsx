"use client";

import React, { useState }
from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Edit3, BookMarked, BarChart3, CheckCircle, ShieldCheck } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { CourseCard, Course } from '@/components/courses/CourseCard'; // Assuming CourseCard is generalized

const mockUser = {
  name: 'Kassio Estude+',
  email: 'kassio@estude.plus',
  photoUrl: 'https://placehold.co/150x150.png',
  initials: 'KE',
  isPremium: true,
  joinDate: 'January 15, 2023',
  overallProgress: 65, // Percentage
  coursesCompleted: 5,
  modulesStudied: 42,
};

const mockSavedCourses: Course[] = [
  { id: '1', title: 'Advanced Calculus', description: 'Master the fundamentals of advanced calculus.', modules: 12, difficulty: 'Advanced', category: 'Mathematics', image: 'https://placehold.co/600x400.png', dataAiHint: 'calculus graph' },
  { id: '4', title: 'Python for Data Science', description: 'Learn Python programming for data analysis.', modules: 15, difficulty: 'Intermediate', category: 'Programming', image: 'https://placehold.co/600x400.png', dataAiHint: 'data visualization' },
];

const mockStudyHistory = [
  { course: 'Introduction to Algebra', status: 'Completed', date: '2023-05-20' },
  { course: 'Basics of Physics', status: 'Completed', date: '2023-08-10' },
  { course: 'Calculus I', status: 'In Progress (70%)', date: 'Ongoing' },
  { course: 'Organic Chemistry', status: 'Not Started', date: '-' },
];


export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);

  const handleSaveProfile = () => {
    // Mock save logic
    mockUser.name = name;
    mockUser.email = email;
    setIsEditing(false);
    // Here you would typically call an API to save changes
  };
  
  return (
    <div className="space-y-8">
      <Card className="shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-accent p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src={mockUser.photoUrl} alt={mockUser.name} data-ai-hint="profile picture" />
              <AvatarFallback className="text-4xl">{mockUser.initials}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-primary-foreground font-headline">{mockUser.name}</h1>
              <p className="text-lg text-primary-foreground/80">{mockUser.email}</p>
              {mockUser.isPremium && (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-background/20 px-3 py-1 text-xs font-semibold text-primary-foreground">
                  <ShieldCheck className="h-4 w-4" /> Premium Member
                </span>
              )}
            </div>
            <Button variant="outline" size="lg" className="md:ml-auto bg-background/20 text-primary-foreground hover:bg-background/30 border-primary-foreground/50" onClick={() => setIsEditing(!isEditing)}>
              <Edit3 className="mr-2 h-5 w-5" /> {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </div>
        
        {isEditing && (
          <CardContent className="p-6 bg-card">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
              <div>
                <Label htmlFor="name" className="text-base">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 text-base h-12" />
              </div>
              <div>
                <Label htmlFor="email" className="text-base">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 text-base h-12" />
              </div>
               <div>
                <Label htmlFor="photoUrl" className="text-base">Photo URL</Label>
                <Input id="photoUrl" type="text" defaultValue={mockUser.photoUrl} className="mt-1 text-base h-12" />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="text-base px-6 py-3">Cancel</Button>
                <Button type="submit" className="text-base px-6 py-3 bg-primary hover:bg-primary/90">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Overall Progress</CardTitle>
            <BarChart3 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">{mockUser.overallProgress}%</div>
            <Progress value={mockUser.overallProgress} className="mt-2 h-3" />
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Courses Completed</CardTitle>
            <CheckCircle className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">{mockUser.coursesCompleted}</div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Modules Studied</CardTitle>
            <BookMarked className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">{mockUser.modulesStudied}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="saved_courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-2 h-14 text-base">
          <TabsTrigger value="saved_courses" className="py-3 text-base">My Saved Courses</TabsTrigger>
          <TabsTrigger value="study_history" className="py-3 text-base">Study History</TabsTrigger>
        </TabsList>
        <TabsContent value="saved_courses" className="mt-6">
          {mockSavedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockSavedCourses.map(course => <CourseCard key={course.id} course={course} />)}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">You haven&apos;t saved any courses yet.</p>
          )}
        </TabsContent>
        <TabsContent value="study_history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Your Learning Journey</CardTitle>
              <CardDescription>Track your progress across all courses.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {mockStudyHistory.map((item, index) => (
                  <li key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">{item.course}</h3>
                      <span className={`text-sm px-2 py-0.5 rounded-full ${item.status.includes('Completed') ? 'bg-green-100 text-green-700' : item.status.includes('Progress') ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Last activity: {item.date}</p>
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
