"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { supabase } from "../../../lib/supabase/client";

export default function TeacherLoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) throw signInError;
      
      // Redirecionar para o dashboard após login bem-sucedido
      window.location.href = "/teacher/dashboard";
    } catch (err: any) {
      setError(err.message || "Falha ao fazer login. Verifique suas credenciais e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/teacher/dashboard`,
        },
      });
      
      if (signInError) throw signInError;
      
      // O redirecionamento é tratado pelo Supabase OAuth
    } catch (err: any) {
      setError(err.message || "Falha ao fazer login com Google. Por favor, tente novamente.");
      setIsLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/teacher/dashboard`,
        },
      });
      
      if (signInError) throw signInError;
      
      // O redirecionamento é tratado pelo Supabase OAuth
    } catch (err: any) {
      setError(err.message || "Falha ao fazer login com Microsoft. Por favor, tente novamente.");
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
          <span>Voltar para seleção de portal</span>
        </Link>
      </div>
      
      <div className="max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Portal do Professor</h1>
          <p className="text-muted-foreground">
            Faça login para gerenciar suas turmas e conteúdos
          </p>
        </div>
        
        <Card className="border rounded-lg overflow-hidden">
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4">
                {error}
              </div>
            )}
            
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
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link 
                    href="/auth/reset-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Ou continue com
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleMicrosoftLogin}
                  disabled={isLoading}
                >
                  Microsoft
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Precisa de ajuda?{" "}
            <Link href="/support" className="text-primary hover:underline">
              Contate o suporte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
