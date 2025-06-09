
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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
  Search,
  Menu,
  BookHeart,
  Sun,
  Moon,
  BarChart3
} from 'lucide-react';

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isPremiumFeature?: boolean;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, isPremiumFeature, isActive, onClick }) => (
  <Link href={href} passHref legacyBehavior>
    <a onClick={onClick}>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className="w-full justify-start text-base py-3"
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className="mr-3 h-5 w-5" />
        {label}
        {isPremiumFeature && (
          <span className="ml-auto text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">
            Premium
          </span>
        )}
      </Button>
    </a>
  </Link>
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      if(isSidebarOpen) closeSidebar();
    }
  };

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Painel' },
    { href: '/courses', icon: BookOpen, label: 'Cursos' },
    { href: '/progress', icon: BarChart3, label: 'Meu Progresso' },
    { href: '/favorites', icon: Heart, label: 'Favoritos' },
    { href: '/community-chat', icon: Users, label: 'Comunidade' },
    { href: '/ai-assistant', icon: Sparkles, label: 'Assistente AI', isPremiumFeature: true },
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
            <NavItem key={item.href} {...item} isActive={pathname === item.href} onClick={closeSidebar} />
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-2 space-y-1">
        {bottomNavItems.map((item) => (
          <NavItem key={item.href} {...item} isActive={pathname === item.href} onClick={closeSidebar} />
        ))}
         <Button variant="ghost" className="w-full justify-start text-base py-3" onClick={() => router.push('/')}>
          Sair
        </Button>
      </div>
    </div>
  );

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
                  aria-label={mounted ? (theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro') : 'Alternar tema'}
                  className="rounded-full h-9 w-9"
                >
                  {mounted && (theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  ))}
                  {!mounted && <Moon className="h-5 w-5" /> }
                </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-muted/40 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
  );
}
