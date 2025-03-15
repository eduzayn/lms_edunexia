import { createServerSupabaseClient } from '../supabase/server';
import { ContentItem } from './content-editor-service';

export interface LtiTool {
  id: string;
  content_id: string;
  version: string;
  name: string;
  description?: string;
  launch_url: string;
  client_id: string;
  deployment_id: string;
  platform_id: string;
  created_at: string;
  updated_at: string;
}

export interface LtiSession {
  id: string;
  user_id: string;
  content_id: string;
  lti_tool_id: string;
  session_token: string;
  state: string;
  created_at: string;
  expires_at: string;
}

export interface LtiProgress {
  id?: string;
  user_id: string;
  content_id: string;
  lti_tool_id: string;
  completion_status?: 'not attempted' | 'incomplete' | 'completed';
  score?: number;
  time_spent?: number;
  created_at?: string;
  updated_at?: string;
}

export interface LtiMetadata {
  version: '1.3';
  name: string;
  description?: string;
  launchUrl: string;
  clientId: string;
  deploymentId: string;
  platformId: string;
}

class LtiService {
  async getLtiTool(contentId: string): Promise<LtiTool | null> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('lti_tools')
      .select('*')
      .eq('content_id', contentId)
      .single();
    
    if (error) {
      console.error(`Error fetching LTI tool for content ${contentId}:`, error);
      return null;
    }
    
    return data as LtiTool;
  }
  
  async createLtiTool(contentId: string, metadata: LtiMetadata): Promise<LtiTool | null> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('lti_tools')
      .insert({
        content_id: contentId,
        version: metadata.version,
        name: metadata.name,
        description: metadata.description,
        launch_url: metadata.launchUrl,
        client_id: metadata.clientId,
        deployment_id: metadata.deploymentId,
        platform_id: metadata.platformId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating LTI tool:', error);
      throw new Error(`Failed to create LTI tool: ${error.message}`);
    }
    
    return data as LtiTool;
  }
  
  async updateLtiTool(id: string, updates: Partial<LtiTool>): Promise<LtiTool | null> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('lti_tools')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating LTI tool ${id}:`, error);
      throw new Error(`Failed to update LTI tool: ${error.message}`);
    }
    
    return data as LtiTool;
  }
  
  async deleteLtiTool(id: string): Promise<boolean> {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase
      .from('lti_tools')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting LTI tool ${id}:`, error);
      throw new Error(`Failed to delete LTI tool: ${error.message}`);
    }
    
    return true;
  }
  
  async createLtiSession(userId: string, contentId: string, ltiToolId: string): Promise<LtiSession | null> {
    const supabase = createServerSupabaseClient();
    const sessionToken = this.generateSessionToken();
    const state = this.generateState();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Session expires in 1 hour
    
    const { data, error } = await supabase
      .from('lti_sessions')
      .insert({
        user_id: userId,
        content_id: contentId,
        lti_tool_id: ltiToolId,
        session_token: sessionToken,
        state: state,
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating LTI session:', error);
      throw new Error(`Failed to create LTI session: ${error.message}`);
    }
    
    return data as LtiSession;
  }
  
  async getLtiSession(sessionToken: string): Promise<LtiSession | null> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('lti_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .single();
    
    if (error) {
      console.error(`Error fetching LTI session with token ${sessionToken}:`, error);
      return null;
    }
    
    return data as LtiSession;
  }
  
  async getLtiProgress(userId: string, contentId: string): Promise<LtiProgress | null> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('lti_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .single();
    
    if (error) {
      console.error(`Error fetching LTI progress for user ${userId} and content ${contentId}:`, error);
      return null;
    }
    
    return data as LtiProgress;
  }
  
  async saveLtiProgress(progressData: LtiProgress): Promise<LtiProgress | null> {
    const supabase = createServerSupabaseClient();
    const { data: existingData } = await supabase
      .from('lti_progress')
      .select('id')
      .eq('user_id', progressData.user_id)
      .eq('content_id', progressData.content_id)
      .single();
    
    let result;
    
    if (existingData) {
      // Update existing progress data
      const { data, error } = await supabase
        .from('lti_progress')
        .update({
          ...progressData,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id)
        .select()
        .single();
      
      if (error) {
        console.error(`Error updating LTI progress data:`, error);
        throw new Error(`Failed to update LTI progress data: ${error.message}`);
      }
      
      result = data;
    } else {
      // Insert new progress data
      const { data, error } = await supabase
        .from('lti_progress')
        .insert({
          ...progressData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error(`Error creating LTI progress data:`, error);
        throw new Error(`Failed to create LTI progress data: ${error.message}`);
      }
      
      result = data;
    }
    
    return result as LtiProgress;
  }

  async trackLtiCompletion(userId: string, contentId: string, completionStatus: 'not attempted' | 'incomplete' | 'completed', score?: number): Promise<boolean> {
    try {
      const ltiTool = await this.getLtiTool(contentId);
      if (!ltiTool) {
        console.error(`No LTI tool found for content ${contentId}`);
        return false;
      }

      const progressData = await this.getLtiProgress(userId, contentId) || {
        user_id: userId,
        content_id: contentId,
        lti_tool_id: ltiTool.id,
        completion_status: 'not attempted'
      };

      progressData.completion_status = completionStatus;
      if (score !== undefined) {
        progressData.score = score;
      }
      
      await this.saveLtiProgress(progressData);
      
      // Also update analytics
      const supabase = createServerSupabaseClient();
      await supabase.from('analytics.student_progress').upsert({
        user_id: userId,
        content_id: contentId,
        progress_percentage: completionStatus === 'completed' ? 100 : 
                             completionStatus === 'incomplete' ? 50 : 0,
        last_accessed: new Date().toISOString(),
        content_type: 'lti'
      }, {
        onConflict: 'user_id,content_id'
      });

      return true;
    } catch (error) {
      console.error('Error tracking LTI completion:', error);
      return false;
    }
  }

  // Helper methods
  private generateSessionToken(): string {
    return `lti_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`;
  }
  
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

export const ltiService = new LtiService();
