
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { toast } from '@/components/ui/use-toast'; 
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { useTheme } from 'next-themes';

import {
  LayoutDashboard,
  BookOpen,
  Users,
  Sparkles, 
  Bell,     
  Heart,    
  UserCircle,
  Settings,
  LogOut,
  Search,
  Menu,
  BookHeart,
  Sun,
  Moon,
  Loader2,
  BarChart3 
} from 'lucide-react';

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isPremium?: boolean; 
  isActive: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, isPremium, isActive, onClick }) => (
  <Link href={href} passHref legacyBehavior>
    <a onClick={onClick}>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className="w-full justify-start text-base py-3"
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className="mr-3 h-5 w-5" />
        {label}
        {isPremium && (
          <span className="ml-auto text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">
            Premium
          </span>
        )}
      </Button>
    </a>
  </Link>
);

interface UserDisplay {
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  initials: string;
  isPremium: boolean; 
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const { theme, setTheme } = useTheme();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userDisplay, setUserDisplay] = useState<UserDisplay | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');


  const fetchUserProfile = useCallback(async (userId: string, userEmail?: string) => {
    try {
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
         
        const { data: profileData, error: profileError } = await supabase
          .from('users') // Nome da sua tabela de perfis no Prisma
          .select('name, email, photo_url, isPremium')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116: row not found
          throw profileError;
        }
        
        const name = profileData?.name || user.user_metadata?.name || user.email?.split('@')[0] || "Usuário";
        const avatarUrl = profileData?.photo_url || user.user_metadata?.avatar_url || `https://placehold.co/100x100.png?text=${(name || "U")[0].toUpperCase()}`;

        setUserDisplay({
            name: name,
            email: profileData?.email || user.email,
            avatarUrl: avatarUrl,
            initials: (name || user.email || 'U').substring(0,2).toUpperCase(),
            isPremium: profileData?.isPremium || false,
        });
      } else {
        router.replace('/login'); 
      }

    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast({ title: "Erro ao carregar perfil", description: (error as Error).message, variant: "destructive"});
    } finally {
      setIsLoadingUser(false);
    }
  }, [supabase, router, toast]); // Adicionado toast às dependências

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoadingUser(true);
        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email);
        } else {
          setUserDisplay(null);
          setIsLoadingUser(false);
          if (pathname !== '/login' && pathname !== '/register' && !pathname.startsWith('/api/auth')) {
            router.replace('/login');
          }
        }
      }
    );
    
     supabase.auth.getSession().then(({ data: { session }}) => {
        if (session?.user) {
          fetchUserProfile(session.user.id, session.user.email);
        } else {
            setIsLoadingUser(false);
            if (pathname !== '/login' && pathname !== '/register' && !pathname.startsWith('/api/auth')) {
                 router.replace('/login');
            }
        }
    });


    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, fetchUserProfile, router, pathname]);

  const handleLogout = async () => {
    setIsLoadingUser(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      toast({ title: "Erro ao Sair", description: error.message, variant: "destructive" });
    } else {
      setUserDisplay(null);
      toast({ title: "Logout Efetuado", description: "Você foi desconectado." });
      router.replace('/login'); 
    }
    setIsSidebarOpen(false);
    setIsLoadingUser(false);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); 
    }
  };

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Painel' },
    { href: '/courses', icon: BookOpen, label: 'Cursos' },
    { href: '/progress', icon: BarChart3, label: 'Meu Progresso' },
    { href: '/favorites', icon: Heart, label: 'Favoritos' },
    { href: '/community-chat', icon: Users, label: 'Comunidade' }, 
    { href: '/ai-assistant', icon: Sparkles, label: 'Assistente AI', isPremium: true }, 
    { href: '/notifications', icon: Bell, label: 'Notificações' }, 
  ];

  const bottomNavItems = [
    { href: '/profile', icon: UserCircle, label: 'Meu Perfil' },
    { href: '/settings', icon: Settings, label: 'Configurações' }, 
  ];

  const closeSidebar = () => setIsSidebarOpen(false);

  const sidebarContent = (
    <div className="flex h-full flex-col bg-card text-card-foreground">
      <div className="flex items-center justify-between border-b p-4 h-20">
        <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold font-headline text-primary" onClick={closeSidebar}>
          <BookHeart className="h-8 w-8" />
          <span>Estude+</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="grid items-start gap-1">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} isActive={pathname === item.href} onClick={closeSidebar} isPremium={item.isPremium && !(userDisplay?.isPremium)} />
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-2 space-y-1">
        {bottomNavItems.map((item) => (
          <NavItem key={item.href} {...item} isActive={pathname === item.href} onClick={closeSidebar} />
        ))}
        <Button variant="ghost" className="w-full justify-start text-base py-3" onClick={handleLogout}>
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );
  
  if (isLoadingUser && !userDisplay) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

 
  if (!userDisplay && !pathname.startsWith('/login') && !pathname.startsWith('/register') && !pathname.startsWith('/api/auth')) {
     return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Redirecionando para o login...</p>
        <Loader2 className="ml-2 h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }


  return (
      <div className="grid min-h-screen w-full md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-card md:block">
          {sidebarContent}
        </div>
        <div className="flex flex-col">
          <header className="flex h-20 items-center gap-4 border-b bg-card px-4 md:px-6 sticky top-0 z-30">
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
              <SheetContent side="left" className="flex flex-col p-0 w-[280px] bg-card">
                {sidebarContent}
              </SheetContent>
            </Sheet>
            
            <div className="relative flex-1 md:grow-0">
              <form onSubmit={handleSearchSubmit}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar cursos..."
                  className="w-full rounded-lg bg-background pl-10 md:w-[280px] lg:w-[320px] h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
            </div>

            <div className="ml-auto flex items-center gap-2 md:gap-4">
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
                  className="rounded-full h-9 w-9" 
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={userDisplay?.avatarUrl || undefined} alt={userDisplay?.name || 'User'} data-ai-hint="user avatar"/>
                      <AvatarFallback>{userDisplay?.initials || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userDisplay?.name || 'Usuário'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userDisplay?.email || 'Não disponível'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Meu Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Configurações</Link>
                  </DropdownMenuItem>
                  {userDisplay?.isPremium && <DropdownMenuItem>Gerenciar Assinatura</DropdownMenuItem>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-muted/40 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
  );
}
