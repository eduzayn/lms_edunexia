'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import GamificationService, { Level, UserLevel } from '@/lib/services/gamification-service';

interface LevelProgressProps {
  userId: string;
}

const LevelProgress: React.FC<LevelProgressProps> = ({ userId }) => {
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [nextLevel, setNextLevel] = useState<Level | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserLevel = async () => {
      try {
        setLoading(true);
        
        const gamificationService = GamificationService.getInstance();
        
        // Fetch user's current level
        const userLevelData = await gamificationService.getUserLevel(userId);
        
        if (userLevelData) {
          setUserLevel(userLevelData);
          
          // Fetch all levels to find the next one
          const levels = await gamificationService.getLevels();
          
          if (userLevelData.level && levels.length > 0) {
            const currentLevelNumber = userLevelData.level.level_number;
            const nextLevelData = levels.find(l => l.level_number === currentLevelNumber + 1);
            
            if (nextLevelData) {
              setNextLevel(nextLevelData);
            }
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user level:', err);
        setError('Não foi possível carregar as informações de nível. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchUserLevel();
  }, [userId]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-24">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4">Carregando nível...</p>
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
  
  if (!userLevel || !userLevel.level) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Informações de nível não disponíveis.</p>
      </div>
    );
  }
  
  const currentLevel = userLevel.level;
  const currentPoints = userLevel.current_points;
  
  // Calculate progress percentage
  let progressPercentage = 100;
  let pointsToNextLevel = 0;
  
  if (nextLevel) {
    const pointsRequired = nextLevel.points_required - currentLevel.points_required;
    const pointsEarned = currentPoints - currentLevel.points_required;
    pointsToNextLevel = nextLevel.points_required - currentPoints;
    
    progressPercentage = Math.min(100, Math.max(0, (pointsEarned / pointsRequired) * 100));
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Seu Nível</h3>
        <span className="text-sm text-gray-500">{currentPoints} pontos totais</span>
      </div>
      
      <div className="flex items-center mb-6">
        <div className="flex-shrink-0 p-3 bg-blue-100 rounded-full mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {currentLevel.icon === 'star-outline' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />}
            {currentLevel.icon === 'star-half' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />}
            {currentLevel.icon === 'star' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />}
            {currentLevel.icon === 'award' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
            {currentLevel.icon === 'award-fill' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
            {currentLevel.icon === 'trophy' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />}
          </svg>
        </div>
        
        <div>
          <div className="flex items-center">
            <h4 className="text-lg font-medium text-gray-900">Nível {currentLevel.level_number}: {currentLevel.name}</h4>
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              Atual
            </span>
          </div>
          
          {currentLevel.description && (
            <p className="text-sm text-gray-600 mt-1">{currentLevel.description}</p>
          )}
        </div>
      </div>
      
      {nextLevel && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso para o próximo nível</span>
            <span>{pointsToNextLevel} pontos restantes</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="flex items-center mt-4">
            <div className="flex-shrink-0 p-2 bg-gray-100 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {nextLevel.icon === 'star-outline' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />}
                {nextLevel.icon === 'star-half' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />}
                {nextLevel.icon === 'star' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />}
                {nextLevel.icon === 'award' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                {nextLevel.icon === 'award-fill' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                {nextLevel.icon === 'trophy' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />}
              </svg>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700">
                Próximo: Nível {nextLevel.level_number} - {nextLevel.name}
              </p>
              {nextLevel.description && (
                <p className="text-xs text-gray-500">{nextLevel.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {!nextLevel && (
        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md">
          <p className="text-sm text-green-800">
            Parabéns! Você atingiu o nível máximo.
          </p>
        </div>
      )}
    </div>
  );
};

export default LevelProgress;
