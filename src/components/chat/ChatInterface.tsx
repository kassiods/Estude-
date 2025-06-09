
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paperclip, Send, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai' | string; 
  avatar?: string;
  timestamp: Date;
  name?: string; 
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  chatTitle: string;
  chatDescription?: string;
  placeholder?: string;
  currentUser?: { id: string; name: string; avatar?: string }; 
}

export function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  chatTitle,
  chatDescription,
  placeholder = "Digite sua mensagem...",
  currentUser,
}: ChatInterfaceProps) {
  const [inputText, setInputText] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (inputText.trim()) {
      setInputText(''); 
      await onSendMessage(inputText.trim());
    }
  };
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if(scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <Card className="flex flex-col h-[calc(100vh-160px)] max-h-[800px] w-full shadow-xl">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-headline">{chatTitle}</CardTitle>
        {chatDescription && <CardDescription>{chatDescription}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((msg) => {
              const isCurrentUser = currentUser ? msg.sender === currentUser.id || msg.sender === 'user' : msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-end gap-3",
                    isCurrentUser ? "justify-end" : "justify-start"
                  )}
                >
                  {!isCurrentUser && (
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={msg.avatar} alt={msg.name || msg.sender.toString()} data-ai-hint="user avatar" />
                      <AvatarFallback>{(msg.name || msg.sender.toString()).substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[70%] rounded-xl px-4 py-3 shadow",
                      isCurrentUser
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-card border rounded-bl-none"
                    )}
                  >
                    {!isCurrentUser && msg.name && <p className="text-xs font-semibold mb-1">{msg.name}</p>}
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className="mt-1 text-xs opacity-70 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {isCurrentUser && currentUser && (
                     <Avatar className="h-10 w-10 border">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} data-ai-hint="user avatar"/>
                      <AvatarFallback>{currentUser.name.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
            {isLoading && messages.length > 0 && messages[messages.length-1].sender === (currentUser?.id || 'user') && (
              <div className="flex items-end gap-3 justify-start">
                 <Avatar className="h-10 w-10 border">
                      <AvatarFallback>AI</AvatarFallback>
                 </Avatar>
                 <div className="bg-card border rounded-xl px-4 py-3 shadow rounded-bl-none">
                    <p className="text-sm text-muted-foreground">AI está pensando...</p>
                 </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex w-full items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 h-12 text-base"
            disabled={isLoading}
          />
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Smile className="h-5 w-5" />
          </Button>
          <Button onClick={handleSend} disabled={isLoading || !inputText.trim()} size="icon" className="bg-primary hover:bg-primary/90 h-12 w-12">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
