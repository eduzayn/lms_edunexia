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
  
  // Helper function to determine badge colors based on transaction type
  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'achievement':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'course_completion':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'assessment_completion':
        return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      case 'login_streak':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'content_creation':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'forum_participation':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'custom':
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600 font-medium">Carregando histórico de pontos...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200 shadow-sm">
        <p className="text-red-600 font-medium">{error}</p>
        <button className="mt-2 px-4 py-2 text-sm bg-white text-red-600 rounded border border-red-300 hover:bg-red-50 transition-colors duration-300">Tentar novamente</button>
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <div className="p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 shadow-sm text-center">
        <p className="text-gray-600 mb-2">Nenhuma transação de pontos encontrada.</p>
        <p className="text-sm text-gray-500">Complete atividades para ganhar pontos e acompanhar seu progresso.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Histórico de Pontos
        </h3>
        <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-full shadow-sm">
          <span className="text-sm font-bold text-blue-700">{totalPoints} pontos totais</span>
        </div>
      </div>
      
      <div className="grid gap-4">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-200 overflow-hidden"
          >
            <div className="flex items-center p-4">
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4
                ${transaction.points >= 0 
                  ? 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 border border-green-200' 
                  : 'bg-gradient-to-br from-red-100 to-pink-100 text-red-600 border border-red-200'}
              `}>
                <span className="text-lg font-bold">
                  {transaction.points >= 0 ? '+' : ''}{transaction.points}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-medium text-gray-900">
                    {transaction.description || 'Sem descrição'}
                  </p>
                  <div className="flex items-center mt-1 sm:mt-0">
                    <span className="text-xs text-gray-500 mr-2">
                      {new Date(transaction.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${getTypeColor(transaction.transaction_type)}
                    `}>
                      {typeLabels[transaction.transaction_type] || transaction.transaction_type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {transactions.length > 5 && (
        <div className="flex justify-center mt-4">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300">
            Ver mais transações
          </button>
        </div>
      )}
    </div>
  );
};

export default PointsHistory;
