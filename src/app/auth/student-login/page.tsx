"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GoogleIcon, MicrosoftIcon } from "@/components/ui/icons";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
});

export default function StudentLoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      // In development mode, bypass authentication and redirect directly
      if (process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true') {
        console.log("Development mode: Bypassing authentication");
        window.location.href = "/student/dashboard";
        return;
      }

      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (signInError) throw signInError;
      
      // Authentication successful, redirect
      console.log("Authentication successful, redirecting...");
      window.location.href = "/student/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      form.setError("root", {
        message: err instanceof Error ? err.message : "Falha ao fazer login. Verifique suas credenciais e tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      // In development mode, bypass authentication and redirect directly
      if (process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true') {
        console.log("Development mode: Bypassing Google authentication");
        window.location.href = "/student/dashboard";
        return;
      }

      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/student/dashboard`,
        },
      });
      
      if (signInError) throw signInError;
      
      // O redirecionamento é tratado pelo Supabase OAuth
    } catch (err) {
      console.error("Google login error:", err);
      form.setError("root", {
        message: err instanceof Error ? err.message : "Falha ao fazer login com Google. Por favor, tente novamente."
      });
      setIsLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    
    try {
      // In development mode, bypass authentication and redirect directly
      if (process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true') {
        console.log("Development mode: Bypassing Microsoft authentication");
        window.location.href = "/student/dashboard";
        return;
      }

      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/student/dashboard`,
        },
      });
      
      if (signInError) throw signInError;
      
      // O redirecionamento é tratado pelo Supabase OAuth
    } catch (err) {
      console.error("Microsoft login error:", err);
      form.setError("root", {
        message: err instanceof Error ? err.message : "Falha ao fazer login com Microsoft. Por favor, tente novamente."
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para seleção de portal</span>
        </Link>
      </div>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Portal do Aluno
        </h1>
        <p className="text-sm text-muted-foreground">
          Faça login para acessar seus cursos e atividades
        </p>
      </div>
      <div className="grid gap-6">
        <ErrorMessage message={form.formState.errors.root?.message} />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Senha</FormLabel>
                    <Link 
                      href="/auth/reset-password" 
                      className="text-sm text-primary hover:underline"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loading size={16} />
                  <span>Entrando...</span>
                </div>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </Form>
        
        <Separator text="Ou continue com" />
        
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loading size={16} />
            ) : (
              <GoogleIcon className="h-4 w-4" />
            )}
            Google
          </Button>
          <Button 
            variant="outline" 
            onClick={handleMicrosoftLogin}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loading size={16} />
            ) : (
              <MicrosoftIcon className="h-4 w-4" />
            )}
            Microsoft
          </Button>
        </div>
        
        <p className="px-8 text-center text-sm text-muted-foreground">
          Ainda não tem uma conta?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </>
  );
}
