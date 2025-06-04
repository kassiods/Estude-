
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; // Correto para App Router
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Sparkles,
  UserCircle,
  Settings,
  LogOut,
  Search,
  Menu,
  BookHeart,
  Bell,
  Sun,
  Moon,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; 

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isPremium?: boolean;
  pathname: string | null;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, isPremium, pathname }) => (
  <Link href={href} passHref>
    <Button
      variant={pathname === href ? 'secondary' : 'ghost'}
      className="w-full justify-start text-base py-6"
      aria-current={pathname === href ? 'page' : undefined}
    >
      <Icon className="mr-3 h-5 w-5" />
      {label}
      {isPremium && (
        <span className="ml-auto text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
          Premium
        </span>
      )}
    </Button>
  </Link>
);

// Simulação do usuário logado - em uma aplicação real, isso viria do estado de autenticação
// Estes dados são apenas para exibição no layout, o perfil real virá da API.
const mockUserDisplay = {
  name: 'Usuário', 
  email: 'usuario@studyhub.com',
  photoUrl: 'https://placehold.co/100x100.png?text=U',
  isPremium: false, 
  initials: 'U'
};


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPathname, setCurrentPathname] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  
  // Este userDisplay pode ser atualizado com dados reais se o layout buscar informações do usuário no futuro
  const [userDisplay, setUserDisplay] = useState(mockUserDisplay); 
  // Em uma app real, você pode querer buscar e atualizar userDisplay com base no usuário logado.
  // Por exemplo, após o login ou quando o app carrega.

  useEffect(() => {
    setCurrentPathname(pathname);
  }, [pathname]);


  const handleLogout = async () => {
    // Limpar o token JWT do localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('supabase_token'); 
    }
    
    // Opcional: Chamar o endpoint de logout do Supabase se necessário (geralmente não para JWT stateless)
    // try {
    //   await supabase.auth.signOut(); 
    // } catch (error) { 
    //   console.error("Error signing out from Supabase:", error); 
    // }
    
    toast({ title: "Logout Efetuado", description: "Você foi desconectado com sucesso." });
    router.push('/login'); 
    
    if (isSidebarOpen) { 
      setIsSidebarOpen(false);
    }
  };

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Painel' },
    { href: '/courses', icon: BookOpen, label: 'Cursos' },
    { href: '/community-chat', icon: Users, label: 'Comunidade' },
    { href: '/ai-assistant', icon: Sparkles, label: 'Assistente AI', isPremium: true }, 
    { href: '/profile', icon: UserCircle, label: 'Meu Perfil' },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between border-b border-sidebar-border p-4 h-20">
        <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold font-headline text-primary">
          <BookHeart className="h-8 w-8" />
          <span>Study Hub</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="grid items-start gap-2">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} pathname={currentPathname} isPremium={item.isPremium && userDisplay.isPremium} />
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t border-sidebar-border p-4 space-y-2">
        <NavItem href="/settings" icon={Settings} label="Configurações" pathname={currentPathname} />
        <Button variant="ghost" className="w-full justify-start text-base py-6" onClick={handleLogout}>
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
      <div className="hidden border-r border-border bg-sidebar md:block">
        {sidebarContent}
      </div>
      <div className="flex flex-col">
        <header className="flex h-20 items-center gap-4 border-b bg-card px-6 sticky top-0 z-30">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
                aria-label="Alternar menu de navegação"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 w-[280px] bg-sidebar text-sidebar-foreground">
              {sidebarContent}
            </SheetContent>
          </Sheet>
          
          <div className="relative flex-1 md:grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar cursos, tópicos..."
              className="w-full rounded-lg bg-background pl-10 md:w-[300px] lg:w-[400px] h-12 text-base"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
             <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-6 w-6" />
                <span className="sr-only">Notificações</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
                className="rounded-full h-10 w-10" 
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">Alternar tema</span>
              </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userDisplay.photoUrl} alt={userDisplay.name} data-ai-hint="user avatar generic" />
                    <AvatarFallback>{userDisplay.initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none font-headline">{userDisplay.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userDisplay.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Configurações</Link>
                </DropdownMenuItem>
                {userDisplay.isPremium && <DropdownMenuItem>Gerenciar Assinatura</DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-background p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
