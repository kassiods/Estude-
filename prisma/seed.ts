
import { PrismaClient, Level, ContentType } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
// import { hash } from 'bcryptjs'; // Não é mais necessário para senhas, Supabase Auth cuida disso

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
  const usersToSeed = [
    { email: 'kassio@estude.plus', name: 'Kassio Borges', isPremium: true, password: 'password123' },
    { email: 'aluno@estude.plus', name: 'Aluno Teste', isPremium: false, password: 'password456' },
  ];

  const createdUserProfiles = [];

  for (const userData of usersToSeed) {
    let authUserId: string;

    // 1. Check if user already exists in Supabase Auth
    const { data: { users: existingAuthUsers }, error: findError } = await supabaseAdmin.auth.admin.listUsers({ email: userData.email } as any);

    if (findError && findError.message !== "No user found with that email") {
        console.error(`Error finding user ${userData.email} in Supabase Auth:`, findError.message);
        continue; 
    }

    if (existingAuthUsers && existingAuthUsers.length > 0) {
      authUserId = existingAuthUsers[0].id;
      console.log(`User ${userData.email} already exists in Supabase Auth with ID: ${authUserId}. Ensuring profile exists.`);
      // Optionally update metadata if needed
      await supabaseAdmin.auth.admin.updateUserById(authUserId, {
        user_metadata: { name: userData.name }
      });
    } else {
      console.log(`Creating user ${userData.email} in Supabase Auth...`);
      const { data: authUserResponse, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // Auto-confirm for seeding
        user_metadata: { name: userData.name },
      });

      if (authError) {
        console.error(`Error creating user ${userData.email} in Supabase Auth:`, authError.message);
        continue; 
      }
      if (!authUserResponse.user) {
        console.error(`User object not returned for ${userData.email} from Supabase Auth.`);
        continue;
      }
      authUserId = authUserResponse.user.id;
      console.log(`User ${userData.email} created in Supabase Auth with ID: ${authUserId}`);
    }

    // 2. Create or update profile in Prisma 'users' table
    const userProfile = await prisma.user.upsert({
      where: { id: authUserId },
      update: {
        name: userData.name,
        isPremium: userData.isPremium,
        email: userData.email, // Ensure email is also updated/set in profile
      },
      create: {
        id: authUserId, // Use the ID from Supabase Auth
        email: userData.email,
        name: userData.name,
        isPremium: userData.isPremium,
      },
    });
    createdUserProfiles.push(userProfile);
    console.log(`Profile for ${userProfile.email} (ID: ${userProfile.id}) ensured in Prisma.`);
  }
  
  if (createdUserProfiles.length === 0) {
    console.warn("No users were seeded or found. Related data might not be seeded correctly.");
    // Depending on your needs, you might want to throw an error or return here.
    // For now, we'll proceed, but relations might be empty.
    // return; 
  }

  const user1 = createdUserProfiles.find(u => u.email === 'kassio@estude.plus');
  const user2 = createdUserProfiles.find(u => u.email === 'aluno@estude.plus');

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
  if (user1) {
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
  }

  // --- Seed Favorites ---
  if (user1) {
    await prisma.favorite.create({
      data: {
        userId: user1.id,
        courseId: course2.id,
      },
    });
    console.log(`Created favorite for ${user1.email} on course: ${course2.title}`);
  }

  // --- Seed ChatMessages ---
  if (user1 && user2) {
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
  }

  // --- Seed Notifications ---
  if (user1) {
    await prisma.notification.create({
      data: {
        userId: user1.id,
        title: 'Bem-vindo ao Estude+!',
        message: 'Seu novo curso "Next.js Avançado" foi adicionado. Bons estudos!',
        link: `/courses/${course1.id}`
      }
    });
  }
  if (user2) {
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
  }

  // --- Seed ConversationHistory (AI Chat) ---
  if (user1) {
    await prisma.conversationHistory.create({
      data: {
        userId: user1.id,
        prompt: 'Me explique Server Components em Next.js.',
        response: 'Server Components permitem renderizar UI no servidor, reduzindo o JavaScript enviado ao cliente e melhorando o tempo de carregamento inicial. Eles podem acessar diretamente fontes de dados do backend.',
      },
    });
    console.log('Created conversation history.');
  }
  
  // --- Seed Admin ---
  if (user1) { // Kassio is an admin
    await prisma.admin.create({
      data: {
        userId: user1.id, 
        isSuperAdmin: true,
      }
    });
    console.log(`Admin profile created for ${user1.email}`);
  }

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
