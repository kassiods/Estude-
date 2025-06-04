
// src/app/api/courses/[id]/modules/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { ContentType } from '@prisma/client';

const moduleCreateSchema = z.object({
  title: z.string().min(3, "Título do módulo deve ter pelo menos 3 caracteres.").max(255),
  description: z.string().optional().nullable(),
  order: z.number().int().positive("Ordem deve ser um número positivo."),
});

const contentCreateSchema = z.object({
  title: z.string().min(1).max(255),
  type: z.nativeEnum(ContentType),
  order: z.number().int().positive(),
  url: z.string().url().optional().nullable(),
  textContent: z.string().optional().nullable(),
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
        contents: { 
          orderBy: { order: 'asc' },
        },
      },
    });
    // No need to check if !modules, findMany returns an empty array if none found
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

// POST create new content within a module (admin only)
// Example: POST /api/courses/{courseId}/modules/{moduleId}/contents
// This route might be better as /api/modules/{moduleId}/contents
// For simplicity, let's assume we get moduleId in the body for now if creating content with module.
// Or, more RESTfully, this POST should be on /api/modules/{moduleId}/contents

// This file is for /api/courses/{courseId}/modules.
// Creating content should likely be in a different route structure, e.g.,
// /api/modules/{moduleId}/contents
// However, if you want to create a module AND its initial content in one go, the module schema could accept a `contents: { create: [] }` block.
// The current POST above only creates the module itself.
