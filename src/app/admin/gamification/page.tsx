'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import GamificationService, { Achievement, Level } from '@/lib/services/gamification-service';

export default function AdminGamificationPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [activeTab, setActiveTab] = useState<'achievements' | 'levels' | 'stats'>('achievements');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const gamificationService = GamificationService.getInstance();
        
        // Fetch achievements
        const achievementsData = await gamificationService.getAchievements(true);
        
        // Fetch levels
        const levelsData = await gamificationService.getLevels();
        
        setAchievements(achievementsData);
        setLevels(levelsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching gamification data:', err);
        setError('Ocorreu um erro ao carregar os dados de gamificação. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Gamificação</h1>
          <p className="text-gray-600 mt-2">
            Gerencie conquistas, níveis e estatísticas de gamificação.
          </p>
        </div>
        <div className="space-x-3">
          <Link 
            href="/admin/gamification/achievements/create"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Nova Conquista
          </Link>
          <Link 
            href="/admin/gamification/levels/create"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Novo Nível
          </Link>
        </div>
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
            onClick={() => setActiveTab('levels')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'levels'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Níveis
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'stats'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Estatísticas
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Nome
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Tipo
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Pontos
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Visibilidade
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {achievements.map((achievement) => (
                    <tr key={achievement.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {achievement.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {achievement.achievement_type === 'course_completion' && 'Conclusão de Curso'}
                        {achievement.achievement_type === 'assessment_score' && 'Avaliação'}
                        {achievement.achievement_type === 'login_streak' && 'Assiduidade'}
                        {achievement.achievement_type === 'content_creation' && 'Criação de Conteúdo'}
                        {achievement.achievement_type === 'forum_participation' && 'Participação em Fórum'}
                        {achievement.achievement_type === 'custom' && 'Personalizado'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {achievement.points}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {achievement.is_hidden ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            Oculta
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Visível
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                        <Link 
                          href={`/admin/gamification/achievements/${achievement.id}`}
                          className="text-blue-600 hover:text-blue-800 mr-4"
                        >
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'levels' && (
          <div className="space-y-6">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Nível
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Nome
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Pontos Necessários
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {levels.map((level) => (
                    <tr key={level.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {level.level_number}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {level.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {level.points_required}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                        <Link 
                          href={`/admin/gamification/levels/${level.id}`}
                          className="text-blue-600 hover:text-blue-800 mr-4"
                        >
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-medium mb-2">Total de Conquistas</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {achievements.length}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-medium mb-2">Níveis Disponíveis</h3>
                <p className="text-3xl font-bold text-green-600">
                  {levels.length}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-medium mb-2">Conquistas Concedidas</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {/* This would need a database query to get the actual count */}
                  {achievements.length > 0 ? '127' : '0'}
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Conquistas Mais Populares</h3>
              
              {achievements.length > 0 ? (
                <div className="space-y-4">
                  {/* This would need actual data from the database */}
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="ml-4 text-sm font-medium">Conclusão do Primeiro Curso (85%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <span className="ml-4 text-sm font-medium">Nota Perfeita em Avaliação (72%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '64%' }}></div>
                    </div>
                    <span className="ml-4 text-sm font-medium">Login por 7 Dias Consecutivos (64%)</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Nenhum dado disponível.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
