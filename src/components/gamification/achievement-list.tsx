'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import GamificationService, { Achievement, UserAchievement } from '@/lib/services/gamification-service';
import AchievementCard from './achievement-card';

interface AchievementListProps {
  userId: string;
  showHidden?: boolean;
}

const AchievementList: React.FC<AchievementListProps> = ({
  userId,
  showHidden = false
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        
        const gamificationService = GamificationService.getInstance();
        
        // Fetch all achievements
        const achievementsData = await gamificationService.getAchievements(showHidden);
        
        // Fetch user's achievements
        const userAchievementsData = await gamificationService.getUserAchievements(userId);
        
        setAchievements(achievementsData);
        setUserAchievements(userAchievementsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError('Não foi possível carregar as conquistas. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchAchievements();
  }, [userId, showHidden]);
  
  // Check if user has achieved a specific achievement
  const getUserAchievement = (achievementId: string) => {
    return userAchievements.find(ua => ua.achievement_id === achievementId);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4">Carregando conquistas...</p>
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
  
  if (achievements.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600">Nenhuma conquista disponível no momento.</p>
      </div>
    );
  }
  
  // Group achievements by type
  const achievementsByType: Record<string, Achievement[]> = {};
  
  achievements.forEach(achievement => {
    if (!achievementsByType[achievement.achievement_type]) {
      achievementsByType[achievement.achievement_type] = [];
    }
    achievementsByType[achievement.achievement_type].push(achievement);
  });
  
  // Get type labels
  const typeLabels: Record<string, string> = {
    'course_completion': 'Conclusão de Cursos',
    'assessment_score': 'Avaliações',
    'login_streak': 'Assiduidade',
    'content_creation': 'Criação de Conteúdo',
    'forum_participation': 'Participação em Fóruns',
    'custom': 'Conquistas Especiais'
  };
  
  return (
    <div className="space-y-8">
      {Object.entries(achievementsByType).map(([type, typeAchievements]) => (
        <div key={type} className="space-y-4">
          <h3 className="text-xl font-semibold">{typeLabels[type] || type}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {typeAchievements.map(achievement => {
              const userAchievement = getUserAchievement(achievement.id);
              return (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  achieved={!!userAchievement}
                  achievedAt={userAchievement?.achieved_at}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AchievementList;
