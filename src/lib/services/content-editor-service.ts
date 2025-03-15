import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'quiz' | 'scorm' | 'lti';
  course_id?: string;
  lesson_id?: string;
  created_at: string;
  updated_at: string;
  metadata?: {
    scorm?: {
      version: '1.2' | '2004';
      entryPoint: string;
      manifestUrl: string;
    };
    lti?: {
      version: '1.3';
      launchUrl: string;
      clientId: string;
      deploymentId: string;
      platformId: string;
    };
    progress?: {
      completion_status?: 'not attempted' | 'incomplete' | 'completed';
      success_status?: 'unknown' | 'passed' | 'failed';
      score?: number;
      time_tracked?: number;
      suspend_data?: string;
    };
  };
}

export interface AIContentSuggestion {
  title: string;
  content: string;
  type: string;
  success?: boolean;
  error?: string;
}

class ContentEditorService {
  async getContentItems() {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching content items:', error);
      return [];
    }
    
    return data as ContentItem[];
  }
  
  async getContentItem(id: string) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching content item ${id}:`, error);
      return null;
    }
    
    return data as ContentItem;
  }
  
  async createContentItem(item: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('content_items')
      .insert({
        ...item,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating content item:', error);
      throw new Error(`Failed to create content item: ${error.message}`);
    }
    
    return data as ContentItem;
  }
  
  async updateContentItem(id: string, updates: Partial<ContentItem>) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('content_items')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating content item ${id}:`, error);
      throw new Error(`Failed to update content item: ${error.message}`);
    }
    
    return data as ContentItem;
  }
  
  async deleteContentItem(id: string) {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting content item ${id}:`, error);
      throw new Error(`Failed to delete content item: ${error.message}`);
    }
    
    return true;
  }
  
  async generateAIContent(prompt: string, type: string): Promise<AIContentSuggestion> {
    // This would normally call an API endpoint to generate content with AI
    // For now, we'll return mock data
    return {
      title: `AI Generated ${type} Content`,
      content: `This is AI-generated content based on your prompt: "${prompt}"`,
      type
    };
  }
  
  async getAISuggestions(): Promise<{success: boolean; suggestions: string[]; error?: string}> {
    // This would normally call an API endpoint to get suggestions
    // For now, we'll return mock data
    return {
      success: true,
      suggestions: [
        'Consider adding more examples to illustrate this concept.',
        'You might want to include a summary at the end of this section.',
        'Adding visual elements could help explain this complex topic.'
      ]
    };
  }
}

export const contentEditorService = new ContentEditorService();
