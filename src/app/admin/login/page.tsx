"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { supabase } from "../../../lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // In development mode, bypass authentication and redirect directly
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Bypassing authentication");
        window.location.href = "/admin/dashboard";
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) throw signInError;
      
      // Check if we have a session
      if (data && data.session) {
        console.log("Authentication successful, redirecting...");
        // Use Next.js router for client-side navigation
        window.location.href = "/admin/dashboard";
      } else {
        // Handle the case where authentication succeeded but no session was returned
        setError("Autenticação bem-sucedida, mas não foi possível iniciar a sessão. Por favor, tente novamente.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Falha ao fazer login. Verifique suas credenciais e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // In development mode, bypass authentication and redirect directly
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Bypassing Google authentication");
        window.location.href = "/admin/dashboard";
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin/dashboard`,
        },
      });
      
      if (signInError) throw signInError;
      
      // O redirecionamento é tratado pelo Supabase OAuth
    } catch (err: any) {
      setError(err.message || "Falha ao fazer login com Google. Por favor, tente novamente.");
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
          <h1 className="text-3xl font-bold mb-2">Portal Administrativo</h1>
          <p className="text-muted-foreground">
            Acesso restrito para administradores da plataforma
          </p>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 text-sm">
              Este portal é destinado apenas a administradores autorizados. 
              Tentativas não autorizadas de acesso são monitoradas e podem resultar em bloqueio.
            </p>
          </div>
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
                  placeholder="admin@suainstituicao.com"
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
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="remember" className="text-sm">
                  Manter conectado neste dispositivo
                </Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Verificando..." : "Entrar"}
              </Button>
            </form>
            
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Ou continue com
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                Google
              </Button>
            </div>
          </div>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Precisa de ajuda?{" "}
            <Link href="/support" className="text-primary hover:underline">
              Contate o suporte técnico
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
