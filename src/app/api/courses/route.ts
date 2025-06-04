// src/app/api/courses/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { Level } from '@prisma/client';

const courseCreateSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres."),
  description: z.string().optional(),
  level: z.nativeEnum(Level).default(Level.BEGINNER),
  imageUrl: z.string().url("URL da imagem inválida.").optional().nullable(),
});

// GET all courses (publicly accessible, can add pagination)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('search');
  const levelFilter = searchParams.get('level') as Level | null;
  // Add pagination params: page, limit

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
        _count: { select: { modules: true } } // Example of including module count
      } 
    });
    // Transform to include modulesCount directly
    const coursesWithModuleCount = courses.map(course => ({
      ...course,
      modulesCount: course._count.modules,
    }));
    return NextResponse.json(coursesWithModuleCount);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Falha ao buscar cursos." }, { status: 500 });
  }
}

// POST create new course (admin only)
export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  // Check if user is admin
  const adminProfile = await prisma.admin.findUnique({ where: { userId: user.id } });
  if (!adminProfile) {
    return NextResponse.json({ error: "Acesso negado. Requer privilégios de administrador." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validatedData = courseCreateSchema.parse(body);

    const newCourse = await prisma.course.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        level: validatedData.level,
        imageUrl: validatedData.imageUrl,
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
