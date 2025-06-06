
"use client";

import React, { useState, useEffect } from 'react';
import { ChatInterface, Message } from '@/components/chat/ChatInterface';
import { aiStudyAssistant, AiStudyAssistantInput, AiStudyAssistantOutput } from '@/ai/flows/ai-study-assistant';

// Mock user, as login is removed. This user is assumed to have access.
const mockUser = {
  id: 'localUser123', // A generic ID for local usage
  name: 'Usuário',
  avatar: 'https://placehold.co/100x100.png?text=U',
};

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);

  useEffect(() => {
    setUserName(mockUser.name);
    setUserAvatar(mockUser.avatar);

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
      const result: AiStudyAssistantOutput = await aiStudyAssistant(input);
      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        text: result.response,
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
