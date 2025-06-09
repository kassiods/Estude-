// Este arquivo src/components/layout/AppLayout.tsx
// parece não estar mais em uso ativo, pois as rotas em /app/*
// utilizam /src/app/(app)/layout.tsx.
// O conteúdo original foi removido para evitar possíveis conflitos
// de build ou confusões, especialmente após a remoção de mocks.

import React from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // console.warn("Atenção: src/components/layout/AppLayout.tsx foi chamado, mas deveria estar obsoleto.");
  return <>{children}</>;
}
