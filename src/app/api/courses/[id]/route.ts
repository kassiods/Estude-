
// src/app/api/courses/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { Level } from '@prisma/client';

const courseUpdateSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres.").max(255).optional(),
  description: z.string().optional().nullable(),
  level: z.nativeEnum(Level).optional(),
  imageUrl: z.string().url("URL da imagem inválida.").optional().nullable(),
  dataAiHint: z.string().optional().nullable(),
});

// GET a single course by ID (publicly accessible)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const courseId = params.id;
  // const supabase = createSupabaseServerClient(); // For fetching user-specific data like progress
  // const { data: { user } } = await supabase.auth.getUser();

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
                // If user is logged in, fetch their progress for this content
                // userProgress: user ? { where: { userId: user.id }, select: { completedAt: true } } : false 
              },
            },
          },
        },
        // If user is logged in, check if this course is favorited by them
        // favorites: user ? { where: { userId: user.id }, select: { id: true } } : false,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Curso não encontrado." }, { status: 404 });
    }

    // Augment course data with user-specific info if user is logged in
    // This part needs careful handling of the 'user' object which might be null
    // const courseWithUserStatus = {
    //   ...course,
    //   isFavorite: user ? course.favorites && course.favorites.length > 0 : false,
    //   modules: course.modules.map(module => ({
    //     ...module,
    //     contents: module.contents.map(content => ({
    //       ...content,
    //       isCompleted: user ? content.userProgress && content.userProgress.length > 0 : false,
    //     }))
    //   }))
    // };
    // For now, returning the raw course data. User-specific augmentation can be added.
    return NextResponse.json(course);
  } catch (error) {
    console.error(`Error fetching course ${courseId}:`, error);
    return NextResponse.json({ error: "Falha ao buscar curso." }, { status: 500 });
  }
}

// PUT update a course (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

// DELETE a course (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    // Consider a soft delete or ensure cascading deletes are handled if modules/contents exist
    await prisma.course.delete({
      where: { id: courseId },
    });
    return NextResponse.json({ message: "Curso deletado com sucesso." }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting course ${courseId}:`, error);
    // Check for specific Prisma errors, e.g., P2025 (Record to delete does not exist)
    return NextResponse.json({ error: "Falha ao deletar curso." }, { status: 500 });
  }
}
