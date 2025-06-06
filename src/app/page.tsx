import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookHeart } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8">
      <div className="text-center space-y-8">
        <BookHeart className="mx-auto h-24 w-24 text-primary" />
        <h1 className="text-5xl md:text-7xl font-bold text-primary font-headline">
          Bem-vindo ao Study Hub
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Sua plataforma inteligente para organizar estudos, aprender com cursos interativos e alcançar seus objetivos acadêmicos com o poder da IA.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/register">Comece Agora</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <Link href="/login">Já tenho conta</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-12">
          Explore cursos, acompanhe seu progresso e interaja com nossa comunidade.
        </p>
      </div>
    </main>
  );
}
