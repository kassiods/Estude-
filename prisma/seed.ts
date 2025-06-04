import { PrismaClient, Level, ContentType } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { hash } from 'bcryptjs'; // For seeding, actual app will use Supabase Auth

const prisma = new PrismaClient();

// Initialize Supabase client with SERVICE ROLE KEY for admin actions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Supabase URL or Service Role Key is not defined in .env file. Cannot seed users.'
  );
}
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log('Start seeding ...');

  // --- Seed Users ---
  // Note: In a real app, users are created via Supabase Auth UI or client libraries.
  // This seeding simulates user creation for dev purposes.
  // IMPORTANT: Supabase Auth handles password hashing. We don't store password_hash in Prisma `User` table.
  // The `id` in Prisma's User table MUST match the `id` from Supabase Auth.

  const usersToSeed = [
    { email: 'kassio@estude.plus', name: 'Kassio Borges', isPremium: true, password: 'password123' },
    { email: 'aluno@estude.plus', name: 'Aluno Teste', isPremium: false, password: 'password456' },
  ];

  const createdUsers = [];

  for (const userData of usersToSeed) {
    // Check if user already exists in Supabase Auth
    const { data: { users: existingAuthUsers }, error: findError } = await supabaseAdmin.auth.admin.listUsers({ email: userData.email } as any); // Cast to any for email filter
    
    let authUserId: string;

    if (findError && findError.message !== "No user found with that email") {
        console.error(`Error finding user ${userData.email} in Supabase Auth:`, findError.message);
        continue; // Skip this user
    }

    if (existingAuthUsers && existingAuthUsers.length > 0) {
      console.log(`User ${userData.email} already exists in Supabase Auth. Using existing ID.`);
      authUserId = existingAuthUsers[0].id;
      
      // Optionally update metadata if needed
      // await supabaseAdmin.auth.admin.updateUserById(authUserId, {
      //   user_metadata: { name: userData.name }
      // });

    } else {
      console.log(`Creating user ${userData.email} in Supabase Auth...`);
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // Auto-confirm for seeding
        user_metadata: { name: userData.name },
      });

      if (authError) {
        console.error(`Error creating user ${userData.email} in Supabase Auth:`, authError.message);
        continue; // Skip this user
      }
      if (!authUser.user) {
        console.error(`User object not returned for ${userData.email}`);
        continue;
      }
      authUserId = authUser.user.id;
      console.log(`User ${userData.email} created in Supabase Auth with ID: ${authUserId}`);
    }

    // Create or update profile in Prisma
    const userProfile = await prisma.user.upsert({
      where: { id: authUserId },
      update: {
        name: userData.name,
        isPremium: userData.isPremium,
      },
      create: {
        id: authUserId, // Use the ID from Supabase Auth
        email: userData.email,
        name: userData.name,
        isPremium: userData.isPremium,
      },
    });
    createdUsers.push(userProfile);
    console.log(`Profile for ${userProfile.email} (ID: ${userProfile.id}) ensured in Prisma.`);
  }
  
  if (createdUsers.length === 0) {
    console.log("No users were created or found, cannot proceed with seeding related data.");
    return;
  }

  const user1 = createdUsers[0]; // Kassio
  const user2 = createdUsers[1]; // Aluno

  // --- Seed Courses ---
  const course1 = await prisma.course.create({
    data: {
      title: 'Next.js Avançado com App Router',
      description: 'Domine o Next.js moderno, Server Components, e construa aplicações robustas.',
      level: Level.ADVANCED,
      imageUrl: 'https://placehold.co/600x400.png?text=Next.js+Avançado',
      modules: {
        create: [
          {
            title: 'Introdução ao App Router',
            description: 'Entendendo a nova arquitetura.',
            order: 1,
            contents: {
              create: [
                { title: 'Visão Geral do App Router', type: ContentType.VIDEO, url: 'https://example.com/video1', order: 1 },
                { title: 'Server Components vs Client Components', type: ContentType.TEXT, textContent: 'Exploração detalhada...', order: 2 },
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
                { title: 'Quiz: Server Actions', type: ContentType.QUIZ, textContent: 'Pergunta 1: ...', order: 2 },
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
      imageUrl: 'https://placehold.co/600x400.png?text=Prisma+Essencial',
      modules: {
        create: [
          {
            title: 'Setup e Modelagem',
            description: 'Configurando Prisma e definindo seu schema.',
            order: 1,
            contents: {
              create: [
                { title: 'Instalando Prisma', type: ContentType.TEXT, textContent: 'Passo a passo para instalar...', order: 1 },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`Created course: ${course2.title}`);

  // --- Seed UserProgress ---
  // Kassio completes the first content of the first module of Course 1
  const firstContentCourse1 = await prisma.content.findFirst({
    where: { module: { courseId: course1.id, order: 1 }, order: 1 },
  });

  if (firstContentCourse1) {
    await prisma.userProgress.create({
      data: {
        userId: user1.id,
        courseId: course1.id,
        moduleId: firstContentCourse1.moduleId,
        contentId: firstContentCourse1.id,
        completedAt: new Date(),
      },
    });
    console.log(`Created progress for ${user1.email} on content: ${firstContentCourse1.title}`);
  }


  // --- Seed Favorites ---
  await prisma.favorite.create({
    data: {
      userId: user1.id,
      courseId: course2.id,
    },
  });
  console.log(`Created favorite for ${user1.email} on course: ${course2.title}`);


  // --- Seed ChatMessages ---
  await prisma.chatMessage.create({
    data: {
      userId: user1.id,
      channel: 'general',
      content: 'Olá! Alguém por aí para discutir Next.js?',
    },
  });
  await prisma.chatMessage.create({
    data: {
      userId: user2.id,
      channel: 'general',
      content: 'Oi Kassio! Estou começando com o App Router.',
    },
  });
  console.log('Created chat messages.');

  // --- Seed Notifications ---
  await prisma.notification.create({
    data: {
      userId: user1.id,
      title: 'Bem-vindo ao Estude+!',
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
  await prisma.conversationHistory.create({
    data: {
      userId: user1.id,
      prompt: 'Me explique Server Components em Next.js.',
      response: 'Server Components permitem renderizar UI no servidor, reduzindo o JavaScript enviado ao cliente...',
    },
  });
  console.log('Created conversation history.');
  
  // --- Seed Admin ---
  await prisma.admin.create({
    data: {
      userId: user1.id, // Kassio is an admin
      isSuperAdmin: true,
    }
  });
  console.log(`Admin profile created for ${user1.email}`);


  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
