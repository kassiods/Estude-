
// src/app/(app)/notifications/page.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, MessageSquareText, CalendarClock, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'new_content' | 'community' | 'reminder' | 'announcement';
  title: string;
  message: string;
  timestamp: string; // ISO date string
  isRead: boolean;
  link?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'new_content',
    title: 'Novo Módulo Disponível!',
    message: "O módulo 'Server Actions Avançadas' foi adicionado ao curso 'Next.js Avançado'. Explore agora!",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: false,
    link: '/courses/clxwg9z960002118z3f9qkvvb'
  },
  {
    id: '2',
    type: 'community',
    title: 'Nova Resposta na Comunidade',
    message: "Sua pergunta no canal 'Matemática - Preparatório ENEM' recebeu uma nova resposta de @MariaS.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isRead: false,
    link: '/community-chat?channel=math_enem'
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Lembrete de Estudo',
    message: "Não se esqueça de continuar seus estudos no curso 'Prisma ORM Essencial'. Você parou na aula 3.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    isRead: true,
    link: '/courses/clxwg9z9t0006118z6z9wlvg0'
  },
  {
    id: '4',
    type: 'announcement',
    title: 'Manutenção Programada',
    message: "Nossa plataforma passará por uma breve manutenção no dia 28/07 às 03:00 (BRT).",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    isRead: true,
  },
];

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  switch (type) {
    case 'new_content': return <Zap className="h-5 w-5 text-blue-500" />;
    case 'community': return <MessageSquareText className="h-5 w-5 text-green-500" />;
    case 'reminder': return <CalendarClock className="h-5 w-5 text-orange-500" />;
    case 'announcement': return <Bell className="h-5 w-5 text-purple-500" />;
    default: return <Bell className="h-5 w-5 text-muted-foreground" />;
  }
};


export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    // Em uma app real, aqui haveria uma chamada à API
    // console.log(`Simulando marcar notificação ${id} como lida.`);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    // console.log("Simulando marcar todas as notificações como lidas.");
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold flex items-center font-headline">
              <Bell className="mr-3 h-8 w-8 text-primary" /> Notificações
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-3 text-sm">{unreadCount} Nova(s)</Badge>
              )}
            </CardTitle>
            <CardDescription>Mantenha-se atualizado com as últimas novidades e atividades.</CardDescription>
          </div>
          <Button onClick={handleMarkAllAsRead} disabled={unreadCount === 0} variant="outline">
            <CheckCheck className="mr-2 h-4 w-4" /> Marcar todas como lidas
          </Button>
        </CardHeader>
      </Card>

      {notifications.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {notifications.map(notification => (
                <li 
                  key={notification.id} 
                  className={`p-4 hover:bg-muted/50 transition-colors ${notification.isRead ? 'opacity-70' : 'bg-primary/5 dark:bg-primary/10'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                       <NotificationIcon type={notification.type} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className={`font-semibold ${notification.isRead ? 'font-normal' : 'text-primary'}`}>{notification.title}</h3>
                         {!notification.isRead && (
                           <Badge variant="default" className="text-xs bg-blue-500 text-white">Nova</Badge>
                         )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(parseISO(notification.timestamp), { addSuffix: true, locale: ptBR })}
                        </p>
                        {!notification.isRead && (
                           <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)} className="text-xs h-auto py-1 px-2">
                             Marcar como lida
                           </Button>
                        )}
                      </div>
                      {notification.link && (
                        <Button variant="link" size="sm" asChild className="p-0 h-auto mt-1 text-xs">
                            <a href={notification.link} target={notification.link.startsWith('/') ? '_self' : '_blank'} rel="noopener noreferrer">
                                Ver Detalhes
                            </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-10 text-center">
             <Bell className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-muted-foreground">Nenhuma notificação por aqui.</h2>
            <p className="text-muted-foreground mt-2">Você está totalmente atualizado!</p>
          </CardContent>
        </Card>
      )}
      <p className="text-center text-sm text-muted-foreground pt-4">
        Este é um feed de notificações apenas para fins demonstrativos.
      </p>
    </div>
  );
}
