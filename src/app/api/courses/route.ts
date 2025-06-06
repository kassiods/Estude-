
// src/app/api/courses/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Level } from '@prisma/client';

const courseCreateSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres.").max(255),
  description: z.string().optional().nullable(),
  level: z.nativeEnum(Level).default(Level.BEGINNER),
  imageUrl: z.string().url("URL da imagem inválida.").optional().nullable(),
  dataAiHint: z.string().optional().nullable(),
});

// GET all courses
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('search');
  const levelFilter = searchParams.get('level') as Level | null;

  try {
    const courses = await prisma.course.findMany({
      where: {
        AND: [
          searchTerm ? {
            OR: [
              { title: { contains: searchTerm, mode: 'insensitive' } },
              { description: { contains: searchTerm, mode: 'insensitive' } },
            ],
          } : {},
          levelFilter ? { level: levelFilter } : {},
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: { 
        _count: { select: { modules: true } },
      } 
    });
    
    const coursesWithDetails = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      imageUrl: course.imageUrl,
      dataAiHint: course.dataAiHint,
      modulesCount: course._count.modules,
    }));

    return NextResponse.json(coursesWithDetails);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Falha ao buscar cursos." }, { status: 500 });
  }
}

// POST create new course
export async function POST(request: NextRequest) {
  // Admin/Auth check removed for simplicity.

  try {
    const body = await request.json();
    const validatedData = courseCreateSchema.parse(body);

    const newCourse = await prisma.course.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        level: validatedData.level,
        imageUrl: validatedData.imageUrl,
        dataAiHint: validatedData.dataAiHint,
      },
    });
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos.", details: error.errors }, { status: 400 });
    }
    console.error("Error creating course:", error);
    return NextResponse.json({ error: "Falha ao criar curso." }, { status: 500 });
  }
}
