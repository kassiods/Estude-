
import { PrismaClient, Level, ContentType } from '@prisma/client';
// import { createClient } from '@supabase/supabase-js'; // Supabase client no longer needed for user seeding

const prisma = new PrismaClient();

// Supabase Admin client for auth is no longer needed here if we are not creating Supabase Auth users
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// if (!supabaseUrl || !supabaseServiceKey) {
//   throw new Error(
//     'Supabase URL or Service Role Key is not defined in .env file. Cannot seed users for Supabase Auth.'
//   );
// }
// const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log('Start seeding ...');

  // --- Seed Users directly in Prisma ---
  // Using fixed UUIDs for consistency in seed data if relationships depend on them.
  // In a real scenario, you might generate UUIDs or let Prisma do it if not pre-defined.
  const user1Data = {
    id: 'e4a5fbc6-1d7b-4e6a-8f0c-0d21a1b2c3d4', // Example fixed UUID
    email: 'kassio@studyhub.com', // Changed from estude.plus to studyhub.com
    name: 'Kassio Borges',
    isPremium: true,
  };
  const user2Data = {
    id: 'f5b6acd7-2e8c-5f7b-9g1d-1e32b2c3d4e5', // Example fixed UUID
    email: 'aluno@studyhub.com', // Changed from estude.plus to studyhub.com
    name: 'Aluno Teste',
    isPremium: false,
  };

  const user1 = await prisma.user.upsert({
    where: { id: user1Data.id },
    update: { email: user1Data.email, name: user1Data.name, isPremium: user1Data.isPremium },
    create: user1Data,
  });
  console.log(`Ensured user: ${user1.email}`);

  const user2 = await prisma.user.upsert({
    where: { id: user2Data.id },
    update: { email: user2Data.email, name: user2Data.name, isPremium: user2Data.isPremium },
    create: user2Data,
  });
  console.log(`Ensured user: ${user2.email}`);

  // --- Seed Courses ---
  const course1 = await prisma.course.create({
    data: {
      title: 'Next.js Avançado com App Router',
      description: 'Domine o Next.js moderno, Server Components, e construa aplicações robustas.',
      level: Level.ADVANCED,
      imageUrl: 'https://placehold.co/600x400.png',
      dataAiHint: 'NextJS React code',
      modules: {
        create: [
          {
            title: 'Introdução ao App Router',
            description: 'Entendendo a nova arquitetura.',
            order: 1,
            contents: {
              create: [
                { title: 'Visão Geral do App Router', type: ContentType.VIDEO, url: 'https://example.com/video1', order: 1 },
                { title: 'Server Components vs Client Components', type: ContentType.TEXT, textContent: 'Exploração detalhada das diferenças, benefícios e casos de uso de cada tipo de componente no Next.js App Router.', order: 2 },
              ],
            },
          },
          {
            title: 'Data Fetching e Mutações',
            description: 'Server Actions e estratégias de cache.',
            order: 2,
            contents: {
              create: [
                { title: 'Usando Server Actions', type: ContentType.VIDEO, url: 'https://example.com/video2', order: 1 },
                { title: 'Quiz: Server Actions', type: ContentType.QUIZ, textContent: JSON.stringify({ questions: [{ q: "O que é um Server Action?", a: "Função..."}] }), order: 2 },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`Created course: ${course1.title}`);

  const course2 = await prisma.course.create({
    data: {
      title: 'Prisma ORM Essencial',
      description: 'Aprenda a modelar seu banco de dados e realizar queries com Prisma.',
      level: Level.INTERMEDIATE,
      imageUrl: 'https://placehold.co/600x400.png',
      dataAiHint: 'database ORM code',
      modules: {
        create: [
          {
            title: 'Setup e Modelagem',
            description: 'Configurando Prisma e definindo seu schema.',
            order: 1,
            contents: {
              create: [
                { title: 'Instalando Prisma', type: ContentType.TEXT, textContent: 'Passo a passo para instalar e configurar o Prisma em seu projeto Next.js.', order: 1 },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`Created course: ${course2.title}`);

  // --- Seed UserProgress ---
  // User1 is now directly from Prisma creation
  const firstContentCourse1Module1 = await prisma.content.findFirst({
    where: { module: { courseId: course1.id, order: 1 }, order: 1 },
  });

  if (firstContentCourse1Module1) {
    await prisma.userProgress.create({
      data: {
        userId: user1.id,
        courseId: course1.id,
        moduleId: firstContentCourse1Module1.moduleId,
        contentId: firstContentCourse1Module1.id,
        completedAt: new Date(),
      },
    });
    console.log(`Created progress for ${user1.email} on content: ${firstContentCourse1Module1.title}`);
  }

  // --- Seed Favorites ---
  // User1 is now directly from Prisma creation
  await prisma.favorite.create({
    data: {
      userId: user1.id,
      courseId: course2.id,
    },
  });
  console.log(`Created favorite for ${user1.email} on course: ${course2.title}`);

  // --- Seed ChatMessages ---
  // user1 and user2 are now directly from Prisma creation
  await prisma.chatMessage.create({
    data: {
      userId: user1.id,
      channel: 'geral',
      content: 'Olá! Alguém por aí para discutir Next.js?',
    },
  });
  await prisma.chatMessage.create({
    data: {
      userId: user2.id,
      channel: 'geral',
      content: 'Oi Kassio! Estou começando com o App Router.',
    },
  });
  console.log('Created chat messages.');

  // --- Seed Notifications ---
  // user1 and user2 are now directly from Prisma creation
  await prisma.notification.create({
    data: {
      userId: user1.id,
      title: 'Bem-vindo ao Study Hub!',
      message: 'Seu novo curso "Next.js Avançado" foi adicionado. Bons estudos!',
      link: `/courses/${course1.id}`
    }
  });
   await prisma.notification.create({
    data: {
      userId: user2.id,
      title: 'Novo curso disponível!',
      message: 'Confira o curso "Prisma ORM Essencial" e aprimore suas habilidades.',
      link: `/courses/${course2.id}`,
      read: true
    }
  });
  console.log('Created notifications.');

  // --- Seed ConversationHistory (AI Chat) ---
  // User1 is now directly from Prisma creation
  await prisma.conversationHistory.create({
    data: {
      userId: user1.id,
      prompt: 'Me explique Server Components em Next.js.',
      response: 'Server Components permitem renderizar UI no servidor, reduzindo o JavaScript enviado ao cliente e melhorando o tempo de carregamento inicial. Eles podem acessar diretamente fontes de dados do backend.',
    },
  });
  console.log('Created conversation history.');

  // --- Seed Admin ---
  // User1 is now directly from Prisma creation
  await prisma.admin.create({
    data: {
      userId: user1.id,
      isSuperAdmin: true,
    }
  });
  console.log(`Admin profile created for ${user1.email}`);

  console.log('Seeding finished.');
}

main()
  .catch(async (e) => {
    console.error("Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
