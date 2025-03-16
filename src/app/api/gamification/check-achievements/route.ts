import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import GamificationService from '@/lib/services/gamification-service';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário não fornecido' },
        { status: 400 }
      );
    }
    
    const gamificationService = GamificationService.getInstance();
    const newAchievements = await gamificationService.checkForAchievements(userId);
    
    return NextResponse.json({ 
      success: true,
      newAchievements,
      count: newAchievements.length
    });
  } catch (error) {
    console.error('Error checking achievements:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar conquistas' },
      { status: 500 }
    );
  }
}
