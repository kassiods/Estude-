
"use client";

import React, { useState, useEffect } from 'react';
import { ChatInterface, Message } from '@/components/chat/ChatInterface';
import { aiStudyAssistant, AiStudyAssistantInput, AiStudyAssistantOutput } from '@/ai/flows/ai-study-assistant';

const genericUser = {
  id: 'localUser123', 
  name: 'Usuário',
  avatar: 'https://placehold.co/100x100.png?text=U',
};

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        id: 'initial-ai-message',
        text: `Olá ${genericUser.name}! Sou seu Assistente de Estudos AI. Como posso te ajudar hoje? Você pode me pedir para explicar conceitos, criar planos de estudo ou recomendar conteúdo.`,
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
      sender: genericUser.id,
      timestamp: new Date(),
      name: genericUser.name,
      avatar: genericUser.avatar,
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

  return (
    <div className="h-full">
       <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        chatTitle="Assistente de Estudos AI"
        chatDescription="Seu tutor pessoal de IA para dúvidas, resumos e planos de estudo."
        placeholder="Pergunte ao Assistente AI..."
        currentUser={genericUser}
      />
    </div>
  );
}
