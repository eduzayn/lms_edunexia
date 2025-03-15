'use client';

import React from 'react';
import { Achievement } from '@/lib/services/gamification-service';

interface AchievementCardProps {
  achievement: Achievement;
  achieved?: boolean;
  achievedAt?: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  achieved = false,
  achievedAt
}) => {
  const defaultIcon = 'award';
  
  // Map achievement types to icons
  const iconMap: Record<string, string> = {
    'course_completion': 'book',
    'assessment_score': 'check-circle',
    'login_streak': 'calendar',
    'content_creation': 'edit',
    'forum_participation': 'message-square',
    'custom': 'award'
  };
  
  const icon = achievement.icon || iconMap[achievement.achievement_type] || defaultIcon;
  
  return (
    <div className={`
      relative p-4 rounded-lg border transition-all
      ${achieved 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm' 
        : 'bg-gray-50 border-gray-200 opacity-70'}
    `}>
      {achieved && (
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Conquistado
          </span>
        </div>
      )}
      
      <div className="flex items-start">
        <div className={`
          flex-shrink-0 p-2 rounded-full mr-4
          ${achieved ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}
        `}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {icon === 'award' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />}
            {icon === 'book' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
            {icon === 'check-circle' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
            {icon === 'calendar' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
            {icon === 'edit' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />}
            {icon === 'message-square' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />}
          </svg>
        </div>
        
        <div>
          <h3 className={`text-lg font-medium ${achieved ? 'text-blue-800' : 'text-gray-700'}`}>
            {achievement.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
          
          <div className="mt-3 flex items-center">
            <span className={`
              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
              ${achieved ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
            `}>
              {achievement.points} pontos
            </span>
            
            {achieved && achievedAt && (
              <span className="ml-2 text-xs text-gray-500">
                Conquistado em {new Date(achievedAt).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;
