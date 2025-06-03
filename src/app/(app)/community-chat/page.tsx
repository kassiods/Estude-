
"use client";

import React, { useState, useEffect } from 'react';
import { ChatInterface, Message } from '@/components/chat/ChatInterface';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Hash, MessageSquare } from 'lucide-react';

interface ChatChannel {
  id: string;
  name: string;
  description: string;
}

const mockChannels: ChatChannel[] = [
  { id: 'general', name: 'Discussão Geral', description: 'Converse sobre qualquer coisa relacionada a estudos.' },
  { id: 'math_enem', name: 'Matemática - Preparatório ENEM', description: 'Foco em matemática para o ENEM.' },
  { id: 'history_vestibular', name: 'História - Vestibular', description: 'Discuta tópicos de história para diversos exames.' },
  { id: 'study_tips', name: 'Dicas e Truques de Estudo', description: 'Compartilhe suas melhores estratégias de estudo.' },
];

const mockMessagesStore: { [channelId: string]: Message[] } = {
  general: [
    { id: '1', text: 'Bem-vindo ao canal de discussão geral!', sender: 'Admin', name: 'Admin', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    { id: '2', text: 'Alguém aqui estudando para a FUVEST?', sender: 'user_ana', name: 'Ana Silva', avatar: 'https://placehold.co/100x100.png?text=AS', timestamp: new Date(Date.now() - 1000 * 60 * 3) },
  ],
  math_enem: [
    { id: '3', text: 'Vamos resolver algumas questões de probabilidade para o ENEM!', sender: 'user_joao', name: 'João Costa', avatar: 'https://placehold.co/100x100.png?text=JC', timestamp: new Date(Date.now() - 1000 * 60 * 10) },
  ],
  history_vestibular: [],
  study_tips: [],
};

const mockCurrentUser = {
  id: 'current_user_123',
  name: 'Carlos Mendes',
  avatar: 'https://placehold.co/100x100.png?text=CM',
};


export default function CommunityChatPage() {
  const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(mockChannels[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    if (selectedChannel) {
      setMessages(mockMessagesStore[selectedChannel.id] || []);
    }
  }, [selectedChannel]);

  const handleSelectChannel = (channel: ChatChannel) => {
    setSelectedChannel(channel);
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedChannel) return;
    setIsLoading(true);
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: mockCurrentUser.id,
      name: mockCurrentUser.name,
      avatar: mockCurrentUser.avatar,
      timestamp: new Date(),
    };
    setTimeout(() => {
      mockMessagesStore[selectedChannel.id] = [...(mockMessagesStore[selectedChannel.id] || []), newMessage];
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 h-[calc(100vh-100px)]">
      <Card className="shadow-lg flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="text-xl flex items-center font-headline">
            <Users className="mr-2 h-6 w-6 text-primary" /> Canais
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-full">
            <nav className="p-4 space-y-2">
              {mockChannels.map(channel => (
                <Button
                  key={channel.id}
                  variant={selectedChannel?.id === channel.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => handleSelectChannel(channel)}
                >
                  <div className="flex items-center">
                    <Hash className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">{channel.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 pl-6">{channel.description}</p>
                </Button>
              ))}
            </nav>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="h-full">
        {selectedChannel ? (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            chatTitle={selectedChannel.name}
            chatDescription={selectedChannel.description}
            placeholder={`Mensagem #${selectedChannel.name.toLowerCase().replace(/\s+/g, '-')}`}
            currentUser={mockCurrentUser}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-card rounded-lg shadow-xl p-8">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold text-muted-foreground font-headline">Selecione um canal</h2>
            <p className="text-muted-foreground mt-2">Escolha um canal da lista para começar a conversar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
