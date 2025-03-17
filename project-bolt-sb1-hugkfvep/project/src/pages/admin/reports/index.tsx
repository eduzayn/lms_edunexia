import React, { useState } from 'react';
import { FileText, Download, Filter, Calendar } from 'lucide-react';
import AdminLayout from '@/components/layout/admin/layout';

const reports = [
  {
    id: 1,
    name: 'Desempenho de Alunos',
    description: 'Análise completa do desempenho acadêmico dos alunos',
    type: 'academic',
    lastGenerated: '2025-03-16T14:30:00Z'
  },
  {
    id: 2,
    name: 'Relatório Financeiro',
    description: 'Resumo de receitas, despesas e inadimplência',
    type: 'financial',
    lastGenerated: '2025-03-15T10:15:00Z'
  },
  {
    id: 3,
    name: 'Engajamento em Cursos',
    description: 'Métricas de participação e conclusão de cursos',
    type: 'engagement',
    lastGenerated: '2025-03-14T16:45:00Z'
  },
  {
    id: 4,
    name: 'Atividade de Professores',
    description: 'Análise da atividade e avaliação dos professores',
    type: 'teachers',
    lastGenerated: '2025-03-13T09:20:00Z'
  },
  {
    id: 5,
    name: 'Matrículas e Evasão',
    description: 'Estatísticas de matrículas, desistências e conclusões',
    type: 'enrollment',
    lastGenerated: '2025-03-12T11:30:00Z'
  }
];

const reportTypes = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'academic', label: 'Acadêmico' },
  { value: 'financial', label: 'Financeiro' },
  { value: 'engagement', label: 'Engajamento' },
  { value: 'teachers', label: 'Professores' },
  { value: 'enrollment', label: 'Matrículas' }
];

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [dateRange, setDateRange] = useState('last30');
  const [loading, setLoading] = useState<number | null>(null);

  const filteredReports = reports.filter(report => 
    selectedType === 'all' || report.type === selectedType
  );

  const handleGenerateReport = async (reportId: number) => {
    setLoading(reportId);
    // Simulação de geração de relatório
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600">Gere e baixe relatórios detalhados do sistema</p>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Relatório
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="last7">Últimos 7 dias</option>
                <option value="last30">Últimos 30 dias</option>
                <option value="last90">Últimos 90 dias</option>
                <option value="year">Este ano</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Relatórios */}
      <div className="grid grid-cols-1 gap-6">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-500 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {report.name}
                  </h3>
                </div>
                <p className="mt-1 text-gray-600">{report.description}</p>
                <p className="mt-2 text-sm text-gray-500">
                  Última geração: {formatDate(report.lastGenerated)}
                </p>
              </div>
              
              <button
                onClick={() => handleGenerateReport(report.id)}
                disabled={loading === report.id}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === report.id ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Gerar Relatório
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}