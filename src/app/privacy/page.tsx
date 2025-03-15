import React from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Política de Privacidade</h1>
        <p className="text-muted-foreground mb-8">
          Última atualização: 14 de março de 2025
        </p>
        
        <div className="prose prose-blue max-w-none">
          <p>
            A Edunexia LMS está comprometida em proteger sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos, compartilhamos e protegemos suas informações pessoais.
          </p>
          
          <h2>1. Informações que Coletamos</h2>
          <p>
            Podemos coletar os seguintes tipos de informações:
          </p>
          <ul>
            <li>Informações de cadastro (nome, e-mail, telefone)</li>
            <li>Informações acadêmicas (cursos, notas, certificados)</li>
            <li>Informações de pagamento (quando aplicável)</li>
            <li>Dados de uso da plataforma</li>
            <li>Informações do dispositivo e navegador</li>
          </ul>
          
          <h2>2. Como Usamos suas Informações</h2>
          <p>
            Utilizamos suas informações para:
          </p>
          <ul>
            <li>Fornecer e melhorar nossos serviços</li>
            <li>Personalizar sua experiência de aprendizagem</li>
            <li>Processar pagamentos e gerenciar sua conta</li>
            <li>Comunicar-nos com você sobre cursos e atualizações</li>
            <li>Cumprir obrigações legais</li>
          </ul>
          
          <h2>3. Compartilhamento de Informações</h2>
          <p>
            Podemos compartilhar suas informações com:
          </p>
          <ul>
            <li>Instituições de ensino parceiras (apenas dados relevantes)</li>
            <li>Processadores de pagamento</li>
            <li>Prestadores de serviços que nos auxiliam</li>
            <li>Autoridades quando exigido por lei</li>
          </ul>
          
          <h2>4. Segurança de Dados</h2>
          <p>
            Implementamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, perda ou alteração.
          </p>
          
          <h2>5. Seus Direitos</h2>
          <p>
            Você tem direito a:
          </p>
          <ul>
            <li>Acessar suas informações pessoais</li>
            <li>Corrigir dados imprecisos</li>
            <li>Solicitar a exclusão de seus dados</li>
            <li>Restringir ou opor-se ao processamento</li>
            <li>Solicitar a portabilidade de dados</li>
          </ul>
          
          <h2>6. Cookies e Tecnologias Semelhantes</h2>
          <p>
            Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência, analisar o uso da plataforma e personalizar conteúdo.
          </p>
          
          <h2>7. Alterações nesta Política</h2>
          <p>
            Podemos atualizar esta política periodicamente. Notificaremos você sobre alterações significativas por e-mail ou através de um aviso em nossa plataforma.
          </p>
          
          <h2>8. Contato</h2>
          <p>
            Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco pelo e-mail: privacidade@edunexia.com.br
          </p>
        </div>
        
        <div className="mt-12 flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline">Página Inicial</Button>
          </Link>
          <Link href="/terms">
            <Button variant="outline">Termos de Uso</Button>
          </Link>
          <Link href="/support">
            <Button variant="outline">Suporte</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
