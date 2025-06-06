
// src/app/api/courses/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Level } from '@prisma/client';

const courseUpdateSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres.").max(255).optional(),
  description: z.string().optional().nullable(),
  level: z.nativeEnum(Level).optional(),
  imageUrl: z.string().url("URL da imagem inválida.").optional().nullable(),
  dataAiHint: z.string().optional().nullable(),
});

// GET a single course by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const courseId = params.id;

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            contents: {
              orderBy: { order: 'asc' },
              select: { 
                id: true, 
                title: true, 
                type: true, 
                order: true, 
                url: true, 
                textContent: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Curso não encontrado." }, { status: 404 });
    }
    return NextResponse.json(course);
  } catch (error) {
    console.error(`Error fetching course ${courseId}:`, error);
    return NextResponse.json({ error: "Falha ao buscar curso." }, { status: 500 });
  }
}

// PUT update a course
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const courseId = params.id;
  // Admin/Auth check removed for simplicity.

  try {
    const body = await request.json();
    const validatedData = courseUpdateSchema.parse(body);

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: validatedData,
    });
    return NextResponse.json(updatedCourse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos.", details: error.errors }, { status: 400 });
    }
    console.error(`Error updating course ${courseId}:`, error);
    return NextResponse.json({ error: "Falha ao atualizar curso." }, { status: 500 });
  }
}

// DELETE a course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const courseId = params.id;
  // Admin/Auth check removed for simplicity.

  try {
    await prisma.course.delete({
      where: { id: courseId },
    });
    return NextResponse.json({ message: "Curso deletado com sucesso." }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting course ${courseId}:`, error);
    return NextResponse.json({ error: "Falha ao deletar curso." }, { status: 500 });
  }
}
