
// src/app/api/courses/[id]/modules/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { ContentType } from '@prisma/client';

const moduleCreateSchema = z.object({
  title: z.string().min(3, "Título do módulo deve ter pelo menos 3 caracteres.").max(255),
  description: z.string().optional().nullable(),
  order: z.number().int().positive("Ordem deve ser um número positivo."),
});

// GET all modules for a specific course
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } // Course ID
) {
  const courseId = params.id;
  try {
    const modules = await prisma.module.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: {
        contents: { 
          orderBy: { order: 'asc' },
        },
      },
    });
    return NextResponse.json(modules);
  } catch (error) {
    console.error(`Error fetching modules for course ${courseId}:`, error);
    return NextResponse.json({ error: "Falha ao buscar módulos." }, { status: 500 });
  }
}

// POST create a new module for a specific course
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } } // Course ID
) {
  const courseId = params.id;
  // Admin/Auth check removed for simplicity as auth system is dismantled.
  // In a real app, you'd re-enable auth checks here.

  try {
    const body = await request.json();
    const validatedData = moduleCreateSchema.parse(body);

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Curso não encontrado." }, { status: 404 });
    }

    const newModule = await prisma.module.create({
      data: {
        ...validatedData,
        courseId: courseId,
      },
    });
    return NextResponse.json(newModule, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos.", details: error.errors }, { status: 400 });
    }
    console.error(`Error creating module for course ${courseId}:`, error);
    return NextResponse.json({ error: "Falha ao criar módulo." }, { status: 500 });
  }
}
