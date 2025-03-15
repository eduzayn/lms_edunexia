import React from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";

export default function TermsPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Termos de Uso</h1>
        <p className="text-muted-foreground mb-8">
          Última atualização: 14 de março de 2025
        </p>
        
        <div className="prose prose-blue max-w-none">
          <p>
            Bem-vindo à Edunexia LMS. Estes Termos de Uso regem seu acesso e uso da plataforma Edunexia, incluindo qualquer conteúdo, funcionalidade e serviços oferecidos.
          </p>
          
          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar ou usar a plataforma Edunexia, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá acessar ou utilizar nossos serviços.
          </p>
          
          <h2>2. Alterações nos Termos</h2>
          <p>
            Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação dos termos atualizados. É sua responsabilidade verificar periodicamente se há atualizações.
          </p>
          
          <h2>3. Acesso à Plataforma</h2>
          <p>
            A Edunexia concede a você uma licença limitada, não exclusiva e não transferível para acessar e utilizar a plataforma para fins educacionais, de acordo com estes Termos de Uso.
          </p>
          
          <h2>4. Contas de Usuário</h2>
          <p>
            Para acessar determinados recursos da plataforma, você precisará criar uma conta. Você é responsável por manter a confidencialidade de suas credenciais de login e por todas as atividades que ocorrerem em sua conta.
          </p>
          
          <h2>5. Conduta do Usuário</h2>
          <p>
            Ao utilizar a plataforma Edunexia, você concorda em não:
          </p>
          <ul>
            <li>Violar leis ou regulamentos aplicáveis</li>
            <li>Infringir direitos de propriedade intelectual</li>
            <li>Transmitir material ofensivo, difamatório ou prejudicial</li>
            <li>Tentar acessar áreas restritas da plataforma</li>
            <li>Interferir no funcionamento da plataforma</li>
            <li>Compartilhar suas credenciais de acesso</li>
          </ul>
          
          <h2>6. Conteúdo Educacional</h2>
          <p>
            Todo o conteúdo disponibilizado na plataforma Edunexia, incluindo textos, gráficos, vídeos e outros materiais, é protegido por direitos autorais e outras leis de propriedade intelectual.
          </p>
          
          <h2>7. Pagamentos e Reembolsos</h2>
          <p>
            As políticas de pagamento e reembolso variam de acordo com o plano contratado e estão sujeitas às condições específicas informadas no momento da contratação.
          </p>
          
          <h2>8. Privacidade</h2>
          <p>
            Nossa Política de Privacidade descreve como coletamos, usamos e compartilhamos suas informações pessoais. Ao utilizar a plataforma Edunexia, você concorda com nossas práticas de privacidade.
          </p>
          
          <h2>9. Limitação de Responsabilidade</h2>
          <p>
            A Edunexia não será responsável por danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo perda de lucros, dados ou uso, decorrentes ou relacionados ao uso da plataforma.
          </p>
          
          <h2>10. Rescisão</h2>
          <p>
            Reservamo-nos o direito de suspender ou encerrar seu acesso à plataforma a qualquer momento, por qualquer motivo, sem aviso prévio.
          </p>
          
          <h2>11. Lei Aplicável</h2>
          <p>
            Estes Termos de Uso serão regidos e interpretados de acordo com as leis do Brasil, independentemente de conflitos de disposições legais.
          </p>
          
          <h2>12. Contato</h2>
          <p>
            Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco pelo e-mail: termos@edunexia.com.br
          </p>
        </div>
        
        <div className="mt-12 flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline">Página Inicial</Button>
          </Link>
          <Link href="/privacy">
            <Button variant="outline">Política de Privacidade</Button>
          </Link>
          <Link href="/support">
            <Button variant="outline">Suporte</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
