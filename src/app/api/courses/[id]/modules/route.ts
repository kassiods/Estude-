// src/app/api/courses/[id]/modules/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { z } from 'zod';

const moduleCreateSchema = z.object({
  title: z.string().min(3, "Título do módulo deve ter pelo menos 3 caracteres."),
  description: z.string().optional().nullable(),
  order: z.number().int().positive("Ordem deve ser um número positivo."),
});

// GET all modules for a specific course (publicly accessible)
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
        contents: { // Optionally include contents or content count
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!modules) {
      return NextResponse.json({ error: "Módulos não encontrados para este curso." }, { status: 404 });
    }
    return NextResponse.json(modules);
  } catch (error) {
    console.error(`Error fetching modules for course ${courseId}:`, error);
    return NextResponse.json({ error: "Falha ao buscar módulos." }, { status: 500 });
  }
}

// POST create a new module for a specific course (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } } // Course ID
) {
  const courseId = params.id;
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const adminProfile = await prisma.admin.findUnique({ where: { userId: user.id } });
  if (!adminProfile) {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validatedData = moduleCreateSchema.parse(body);

    // Check if course exists
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
