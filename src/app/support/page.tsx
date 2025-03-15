import React from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Suporte</h1>
        <p className="text-muted-foreground mb-8">
          Estamos aqui para ajudar. Entre em contato conosco ou consulte nossos recursos de suporte.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contato Direto</h2>
            <form className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Seu nome completo" className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="seu.email@exemplo.com" className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="subject">Assunto</Label>
                <Input id="subject" placeholder="Assunto da mensagem" className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="message">Mensagem</Label>
                <Textarea id="message" placeholder="Descreva sua dúvida ou problema em detalhes..." className="mt-1" rows={5} />
              </div>
              
              <Button type="submit" className="w-full">Enviar Mensagem</Button>
            </form>
          </Card>
          
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Canais de Atendimento</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Telefone</h3>
                    <p className="text-sm text-muted-foreground">+55 (11) 3456-7890</p>
                    <p className="text-sm text-muted-foreground">Segunda a Sexta, 8h às 18h</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">E-mail</h3>
                    <p className="text-sm text-muted-foreground">suporte@edunexia.com.br</p>
                    <p className="text-sm text-muted-foreground">Resposta em até 24 horas</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Chat Online</h3>
                    <p className="text-sm text-muted-foreground">Disponível no canto inferior direito</p>
                    <p className="text-sm text-muted-foreground">Atendimento em tempo real</p>
                  </div>
                </li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">FAQ</h2>
              <p className="text-muted-foreground mb-4">
                Consulte nossa base de perguntas frequentes para respostas rápidas.
              </p>
              <Button className="w-full">Acessar FAQ</Button>
            </Card>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Não encontrou o que procurava? Volte para a página inicial ou consulte nossos termos.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/">
              <Button variant="outline">Página Inicial</Button>
            </Link>
            <Link href="/terms">
              <Button variant="outline">Termos de Uso</Button>
            </Link>
            <Link href="/privacy">
              <Button variant="outline">Política de Privacidade</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
