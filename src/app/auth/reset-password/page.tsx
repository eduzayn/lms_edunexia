"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export default function ResetPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Simulação de envio de e-mail - em produção, isso seria uma chamada real para o Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
    } catch {
      setError("Falha ao enviar e-mail de recuperação. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="mb-4">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para login</span>
        </Link>
      </div>
      
      <div className="max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Recuperar Senha</h1>
          <p className="text-muted-foreground">
            Enviaremos um link para redefinir sua senha
          </p>
        </div>
        
        <Card className="border rounded-lg overflow-hidden">
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4">
                {error}
              </div>
            )}
            
            {success ? (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-4">
                <p className="font-medium">E-mail enviado com sucesso!</p>
                <p className="mt-1">
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Digite o e-mail associado à sua conta
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
                </Button>
              </form>
            )}
          </div>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Lembrou sua senha?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Voltar para login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
