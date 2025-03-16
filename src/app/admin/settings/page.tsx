import React from "react";
import { Card } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações da plataforma</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Configurações Gerais</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome da Instituição</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                placeholder="Nome da sua instituição"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Logo da Instituição</label>
              <input 
                type="file" 
                className="w-full p-2 border rounded-md" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cores Primárias</label>
              <div className="flex space-x-2">
                <input type="color" className="h-10 w-10" />
                <input type="color" className="h-10 w-10" />
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Configurações de Email</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Servidor SMTP</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                placeholder="smtp.exemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Porta</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded-md" 
                placeholder="587"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email de Envio</label>
              <input 
                type="email" 
                className="w-full p-2 border rounded-md" 
                placeholder="noreply@suainstituicao.com"
              />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Integrações</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">API Key OpenAI</label>
              <input 
                type="password" 
                className="w-full p-2 border rounded-md" 
                placeholder="sk-..."
              />
            </div>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Integração Lytex (Matrículas)</h3>
            <div>
              <label className="block text-sm font-medium mb-1">API Key Lytex</label>
              <input 
                type="password" 
                className="w-full p-2 border rounded-md" 
                placeholder="lytex-api-key-..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lytex API URL</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                placeholder="https://api.lytex.com/v1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Webhook URL - Matrículas</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                placeholder="https://sua-url.com/api/webhooks/lytex"
                readOnly
              />
              <p className="text-xs text-muted-foreground mt-1">Configure este URL no painel da Lytex para receber atualizações de matrículas</p>
            </div>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Integração InfinityPay (Pagamentos)</h3>
            <div>
              <label className="block text-sm font-medium mb-1">API Key InfinityPay</label>
              <input 
                type="password" 
                className="w-full p-2 border rounded-md" 
                placeholder="infinitypay-api-key-..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">InfinityPay API URL</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                placeholder="https://api.infinitypay.com/v1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Webhook URL - Pagamentos</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                placeholder="https://sua-url.com/api/webhooks/infinitypay"
                readOnly
              />
              <p className="text-xs text-muted-foreground mt-1">Configure este URL no painel do InfinityPay para receber atualizações de pagamentos</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Módulos Ativos</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input type="checkbox" id="module-ai" className="mr-2" checked />
              <label htmlFor="module-ai">Módulo de IA</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="module-financial" className="mr-2" checked />
              <label htmlFor="module-financial">Módulo Financeiro</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="module-content" className="mr-2" checked />
              <label htmlFor="module-content">Módulo de Conteúdo</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="module-assessment" className="mr-2" checked />
              <label htmlFor="module-assessment">Módulo de Avaliações</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="module-forum" className="mr-2" checked />
              <label htmlFor="module-forum">Módulo de Fóruns</label>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <button className="bg-primary text-white px-4 py-2 rounded-md">
          Salvar Configurações
        </button>
      </div>
    </div>
  );
}
