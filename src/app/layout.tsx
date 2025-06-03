import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Import Inter font
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { ThemeProvider } from '@/components/layout/ThemeProviderClient';

// Initialize Inter font with subsets
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Study Hub',
  description: 'Sua plataforma de aprendizado personalizada.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* The Inter font is now handled by next/font, so direct link is not strictly needed if using inter.className or inter.variable */}
        {/* Keeping this structure if other fonts are added via direct links as per guidelines */}
         <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
