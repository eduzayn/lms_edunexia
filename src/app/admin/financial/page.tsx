import React from "react";
import { Card } from "@/components/ui/card";

export default function AdminFinancialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gestão Financeira</h1>
        <p className="text-muted-foreground">Gerencie as finanças da plataforma</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-green-50">
          <h2 className="text-xl font-semibold mb-2">Receita Total</h2>
          <p className="text-3xl font-bold text-green-600">R$ 125.450,00</p>
          <p className="text-sm text-green-600">+12% em relação ao mês anterior</p>
        </Card>
        
        <Card className="p-6 bg-blue-50">
          <h2 className="text-xl font-semibold mb-2">Mensalidades Ativas</h2>
          <p className="text-3xl font-bold text-blue-600">342</p>
          <p className="text-sm text-blue-600">+5% em relação ao mês anterior</p>
        </Card>
        
        <Card className="p-6 bg-red-50">
          <h2 className="text-xl font-semibold mb-2">Inadimplência</h2>
          <p className="text-3xl font-bold text-red-600">8,2%</p>
          <p className="text-sm text-red-600">-2% em relação ao mês anterior</p>
        </Card>
      </div>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Faturas Recentes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aluno</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12345</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">João Silva</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 199,90</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Pago</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/03/2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-indigo-600 hover:text-indigo-900">Ver</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12344</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Maria Oliveira</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 299,90</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendente</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">14/03/2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-indigo-600 hover:text-indigo-900">Ver</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12343</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Carlos Santos</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 199,90</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Atrasado</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10/03/2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-indigo-600 hover:text-indigo-900">Ver</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Métodos de Pagamento</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">CC</span>
                </div>
                <div>
                  <p className="font-medium">Cartão de Crédito</p>
                  <p className="text-sm text-gray-500">45% das transações</p>
                </div>
              </div>
              <p className="font-semibold">R$ 56.452,50</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold">PIX</span>
                </div>
                <div>
                  <p className="font-medium">PIX</p>
                  <p className="text-sm text-gray-500">35% das transações</p>
                </div>
              </div>
              <p className="font-semibold">R$ 43.907,50</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-yellow-600 font-bold">BOL</span>
                </div>
                <div>
                  <p className="font-medium">Boleto</p>
                  <p className="text-sm text-gray-500">20% das transações</p>
                </div>
              </div>
              <p className="font-semibold">R$ 25.090,00</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Taxas Administrativas</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Certificados</p>
                <p className="text-sm text-gray-500">42 emitidos este mês</p>
              </div>
              <p className="font-semibold">R$ 2.100,00</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Declarações</p>
                <p className="text-sm text-gray-500">28 emitidas este mês</p>
              </div>
              <p className="font-semibold">R$ 840,00</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Históricos</p>
                <p className="text-sm text-gray-500">15 emitidos este mês</p>
              </div>
              <p className="font-semibold">R$ 750,00</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Outros</p>
                <p className="text-sm text-gray-500">12 solicitações</p>
              </div>
              <p className="font-semibold">R$ 600,00</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
