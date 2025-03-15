'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import LevelProgress from '@/components/gamification/level-progress';
import AchievementList from '@/components/gamification/achievement-list';
import PointsHistory from '@/components/gamification/points-history';

export default function StudentGamificationPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'achievements' | 'points' | 'leaderboard'>('achievements');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
        } else {
          setError('Usuário não autenticado. Por favor, faça login para visualizar suas conquistas.');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Ocorreu um erro ao carregar os dados do usuário. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [supabase]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg">Carregando dados de gamificação...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600 mb-4">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gamificação</h1>
        <p className="text-gray-600 mt-2">
          Acompanhe seu progresso, conquistas e pontos na plataforma.
        </p>
      </div>
      
      {userId && (
        <div className="space-y-8">
          {/* Level Progress */}
          <div className="mb-8">
            <LevelProgress userId={userId} />
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('achievements')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'achievements'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Conquistas
              </button>
              <button
                onClick={() => setActiveTab('points')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'points'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Histórico de Pontos
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'leaderboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Ranking
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'achievements' && (
              <AchievementList userId={userId} showHidden={false} />
            )}
            
            {activeTab === 'points' && (
              <PointsHistory userId={userId} limit={20} />
            )}
            
            {activeTab === 'leaderboard' && (
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600">Ranking em breve disponível.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
