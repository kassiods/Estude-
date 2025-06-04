
// src/app/api/courses/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { Level } from '@prisma/client';

const courseCreateSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres.").max(255),
  description: z.string().optional().nullable(),
  level: z.nativeEnum(Level).default(Level.BEGINNER),
  imageUrl: z.string().url("URL da imagem inválida.").optional().nullable(),
  dataAiHint: z.string().optional().nullable(),
});

// GET all courses (publicly accessible, can add pagination and filtering)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('search');
  const levelFilter = searchParams.get('level') as Level | null;
  // TODO: Add pagination params: page, limit

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
         // Consider if you need to fetch user progress or favorite status here for the listing
         // This would require knowing the current user, if any
      } 
    });
    
    // Transform to include modulesCount directly and simplify structure
    const coursesWithDetails = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      imageUrl: course.imageUrl,
      dataAiHint: course.dataAiHint,
      modulesCount: course._count.modules,
      // Add other fields as needed for the course listing page
    }));

    return NextResponse.json(coursesWithDetails);
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
    return NextResponse.json({ error: "Não autorizado. Requer login." }, { status: 401 });
  }

  // Check if user is admin by looking up their profile in the Admin table
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
