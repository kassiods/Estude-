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
        text: `Hello ${mockUser.name}! I'm your AI Study Assistant. How can I help you today? You can ask me to explain concepts, create study plans, or recommend content.`,
        sender: 'ai',
        timestamp: new Date(),
        name: 'AI Assistant'
      }
    ]);
  }, []);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      text,
      sender: mockUser.id, // Use mockUser.id for sender to align with ChatInterface logic
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
        name: 'AI Assistant'
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("AI Assistant error:", error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
        name: 'AI Assistant'
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
          <AlertTitle className="text-2xl font-bold mb-2 font-headline">Premium Feature</AlertTitle>
          <AlertDescription className="text-lg">
            The AI Study Assistant is available exclusively for Premium members. Upgrade your account to unlock this and many other powerful features!
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
        chatTitle="AI Study Assistant"
        chatDescription="Your personal AI tutor for doubts, summaries, and study plans."
        placeholder="Ask the AI Assistant..."
        currentUser={currentUserForChat}
      />
    </div>
  );
}
