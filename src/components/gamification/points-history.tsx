'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import GamificationService, { PointsTransaction } from '@/lib/services/gamification-service';

interface PointsHistoryProps {
  userId: string;
  limit?: number;
}

const PointsHistory: React.FC<PointsHistoryProps> = ({
  userId,
  limit = 10
}) => {
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPointsHistory = async () => {
      try {
        setLoading(true);
        
        const gamificationService = GamificationService.getInstance();
        
        // Fetch points transactions
        const transactionsData = await gamificationService.getPointsTransactions(userId, limit);
        
        // Fetch total points
        const points = await gamificationService.getUserPoints(userId);
        
        setTransactions(transactionsData);
        setTotalPoints(points);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching points history:', err);
        setError('Não foi possível carregar o histórico de pontos. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchPointsHistory();
  }, [userId, limit]);
  
  // Get transaction type labels
  const typeLabels: Record<string, string> = {
    'achievement': 'Conquista',
    'course_completion': 'Conclusão de Curso',
    'assessment_completion': 'Avaliação',
    'login_streak': 'Assiduidade',
    'content_creation': 'Criação de Conteúdo',
    'forum_participation': 'Participação em Fórum',
    'custom': 'Personalizado'
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4">Carregando histórico de pontos...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600">Nenhuma transação de pontos encontrada.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Histórico de Pontos</h3>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {totalPoints} pontos totais
        </div>
      </div>
      
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Descrição
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Tipo
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Data
              </th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                Pontos
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {transaction.description || 'Sem descrição'}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {typeLabels[transaction.transaction_type] || transaction.transaction_type}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {new Date(transaction.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium">
                  <span className={transaction.points >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {transaction.points >= 0 ? '+' : ''}{transaction.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PointsHistory;
