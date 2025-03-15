import { createServerSupabaseClient } from '../supabase/server';
import { ContentItem } from './content-editor-service';

export interface ScormPackage {
  id: string;
  content_id: string;
  version: '1.2' | '2004';
  package_url: string;
  manifest_url: string;
  entry_point: string;
  created_at: string;
  updated_at: string;
}

export interface ScormTrackingData {
  id?: string;
  user_id: string;
  content_id: string;
  scorm_package_id: string;
  lesson_status?: string;
  completion_status?: 'not attempted' | 'incomplete' | 'completed';
  success_status?: 'unknown' | 'passed' | 'failed';
  score_raw?: number;
  score_min?: number;
  score_max?: number;
  score_scaled?: number;
  total_time?: string;
  session_time?: string;
  suspend_data?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ScormMetadata {
  version: '1.2' | '2004';
  packageUrl: string;
  manifestUrl: string;
  entryPoint: string;
}

class ScormService {
  async getScormPackage(contentId: string): Promise<ScormPackage | null> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('scorm_packages')
      .select('*')
      .eq('content_id', contentId)
      .single();
    
    if (error) {
      console.error(`Error fetching SCORM package for content ${contentId}:`, error);
      return null;
    }
    
    return data as ScormPackage;
  }
  
  async createScormPackage(contentId: string, metadata: ScormMetadata): Promise<ScormPackage | null> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('scorm_packages')
      .insert({
        content_id: contentId,
        version: metadata.version,
        package_url: metadata.packageUrl,
        manifest_url: metadata.manifestUrl,
        entry_point: metadata.entryPoint,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating SCORM package:', error);
      throw new Error(`Failed to create SCORM package: ${error.message}`);
    }
    
    return data as ScormPackage;
  }
  
  async updateScormPackage(id: string, updates: Partial<ScormPackage>): Promise<ScormPackage | null> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('scorm_packages')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating SCORM package ${id}:`, error);
      throw new Error(`Failed to update SCORM package: ${error.message}`);
    }
    
    return data as ScormPackage;
  }
  
  async deleteScormPackage(id: string): Promise<boolean> {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase
      .from('scorm_packages')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting SCORM package ${id}:`, error);
      throw new Error(`Failed to delete SCORM package: ${error.message}`);
    }
    
    return true;
  }
  
  async getScormTrackingData(userId: string, contentId: string): Promise<ScormTrackingData | null> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('scorm_tracking')
      .select('*')
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .single();
    
    if (error) {
      console.error(`Error fetching SCORM tracking data for user ${userId} and content ${contentId}:`, error);
      return null;
    }
    
    return data as ScormTrackingData;
  }
  
  async saveScormTrackingData(trackingData: ScormTrackingData): Promise<ScormTrackingData | null> {
    const supabase = createServerSupabaseClient();
    const { data: existingData } = await supabase
      .from('scorm_tracking')
      .select('id')
      .eq('user_id', trackingData.user_id)
      .eq('content_id', trackingData.content_id)
      .single();
    
    let result;
    
    if (existingData) {
      // Update existing tracking data
      const { data, error } = await supabase
        .from('scorm_tracking')
        .update({
          ...trackingData,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id)
        .select()
        .single();
      
      if (error) {
        console.error(`Error updating SCORM tracking data:`, error);
        throw new Error(`Failed to update SCORM tracking data: ${error.message}`);
      }
      
      result = data;
    } else {
      // Insert new tracking data
      const { data, error } = await supabase
        .from('scorm_tracking')
        .insert({
          ...trackingData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error(`Error creating SCORM tracking data:`, error);
        throw new Error(`Failed to create SCORM tracking data: ${error.message}`);
      }
      
      result = data;
    }
    
    return result as ScormTrackingData;
  }

  async getScormApiVersion(contentId: string): Promise<'1.2' | '2004' | null> {
    const scormPackage = await this.getScormPackage(contentId);
    if (!scormPackage) {
      return null;
    }
    return scormPackage.version;
  }

  async trackScormCompletion(userId: string, contentId: string, completionStatus: 'not attempted' | 'incomplete' | 'completed'): Promise<boolean> {
    try {
      const scormPackage = await this.getScormPackage(contentId);
      if (!scormPackage) {
        console.error(`No SCORM package found for content ${contentId}`);
        return false;
      }

      const trackingData = await this.getScormTrackingData(userId, contentId) || {
        user_id: userId,
        content_id: contentId,
        scorm_package_id: scormPackage.id,
        completion_status: 'not attempted'
      };

      trackingData.completion_status = completionStatus;
      
      await this.saveScormTrackingData(trackingData);
      
      // Also update analytics
      const supabase = createServerSupabaseClient();
      await supabase.from('analytics.student_progress').upsert({
        user_id: userId,
        content_id: contentId,
        progress_percentage: completionStatus === 'completed' ? 100 : 
                             completionStatus === 'incomplete' ? 50 : 0,
        last_accessed: new Date().toISOString(),
        content_type: 'scorm'
      }, {
        onConflict: 'user_id,content_id'
      });

      return true;
    } catch (error) {
      console.error('Error tracking SCORM completion:', error);
      return false;
    }
  }
}

export const scormService = new ScormService();
