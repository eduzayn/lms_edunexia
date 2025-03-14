"use client";

import * as React from "react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export default function AITutorError({ error, reset }) {
  React.useEffect(() => {
    console.error("AI Tutor error:", error);
  }, [error]);

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Serviço Temporariamente Indisponível</h2>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">
            O serviço de tutoria com IA está temporariamente indisponível. 
            Nossa equipe técnica já foi notificada.
          </p>
        </div>
        <p className="mb-6 text-muted-foreground">
          Isso pode ocorrer devido à falta de configuração do serviço ou problemas temporários 
          com nossos provedores de IA. Por favor, tente novamente mais tarde.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>Tentar Novamente</Button>
          <Link href="/student/dashboard">
            <Button variant="outline">Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
