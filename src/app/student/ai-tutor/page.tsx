"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import the client component with no SSR
const AITutorClient = dynamic(() => import("./page-client"), { 
  loading: () => <p>Carregando tutor de IA...</p>
});

export default function AITutorPage() {
  return (
    <Suspense fallback={<p>Carregando tutor de IA...</p>}>
      <AITutorClient />
    </Suspense>
  );
}
