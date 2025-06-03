
"use client";

import React, { useState, useEffect } from 'react';
import { ChatInterface, Message } from '@/components/chat/ChatInterface';
import { aiStudyAssistant, AiStudyAssistantInput, AiStudyAssistantOutput } from '@/ai/flows/ai-study-assistant';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck, Sparkles } from "lucide-react";

const mockUser = {
  id: 'user123',
  name: 'Kassio',
  avatar: 'https://placehold.co/100x100.png',
  isPremium: true, // Simulate premium status
};

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Simulate fetching user data
    setUserName(mockUser.name);
    setUserAvatar(mockUser.avatar);

    // Initial AI message
    setMessages([
      {
        id: 'initial-ai-message',
        text: `Olá ${mockUser.name}! Sou seu Assistente de Estudos AI. Como posso te ajudar hoje? Você pode me pedir para explicar conceitos, criar planos de estudo ou recomendar conteúdo.`,
        sender: 'ai',
        timestamp: new Date(),
        name: 'Assistente AI'
      }
    ]);
  }, []);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      text,
      sender: mockUser.id, 
      timestamp: new Date(),
      name: mockUser.name,
      avatar: mockUser.avatar,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const input: AiStudyAssistantInput = { query: text };
      const result: AiStudyAssistantOutput = await aiStudyAssistant(input); // Prompt is in English, response will be too unless AI is instructed otherwise
      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        text: result.response, // Consider if AI response needs translation or if prompt should ask for pt-BR
        sender: 'ai',
        timestamp: new Date(),
        name: 'Assistente AI'
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("AI Assistant error:", error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: "Desculpe, encontrei um erro. Por favor, tente novamente.",
        sender: 'ai',
        timestamp: new Date(),
        name: 'Assistente AI'
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mockUser.isPremium) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Alert className="max-w-md text-center bg-card shadow-xl">
          <ShieldCheck className="h-8 w-8 mx-auto mb-4 text-primary" />
          <AlertTitle className="text-2xl font-bold mb-2 font-headline">Recurso Premium</AlertTitle>
          <AlertDescription className="text-lg">
            O Assistente de Estudos AI está disponível exclusivamente para membros Premium. Atualize sua conta para desbloquear este e muitos outros recursos poderosos!
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const currentUserForChat = userName ? { id: mockUser.id, name: userName, avatar: userAvatar } : undefined;

  return (
    <div className="h-full">
       <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        chatTitle="Assistente de Estudos AI"
        chatDescription="Seu tutor pessoal de IA para dúvidas, resumos e planos de estudo."
        placeholder="Pergunte ao Assistente AI..."
        currentUser={currentUserForChat}
      />
    </div>
  );
}
