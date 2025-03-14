import { createClient } from '@supabase/supabase-js';

interface VideoGenerationJob {
  id: string;
  userId: string;
  request: Record<string, unknown>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: Record<string, unknown>;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export class VideoQueueService {
  private static instance: VideoQueueService;
  private supabaseUrl: string;
  private supabaseKey: string;
  
  private constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  }
  
  public static getInstance(): VideoQueueService {
    if (!VideoQueueService.instance) {
      VideoQueueService.instance = new VideoQueueService();
    }
    return VideoQueueService.instance;
  }
  
  async createJob(userId: string, request: Record<string, unknown>): Promise<{ success: boolean; jobId?: string; error?: string }> {
    try {
      const supabase = createClient(this.supabaseUrl, this.supabaseKey);
      
      const { data, error } = await supabase
        .from('content.video_jobs')
        .insert({
          user_id: userId,
          request: request,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating video job:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true, jobId: data.id };
    } catch (error) {
      console.error('Error in createJob:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
  
  async getJob(jobId: string): Promise<{ success: boolean; job?: VideoGenerationJob; error?: string }> {
    try {
      const supabase = createClient(this.supabaseUrl, this.supabaseKey);
      
      const { data, error } = await supabase
        .from('content.video_jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      
      if (error) {
        console.error('Error fetching video job:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true, job: data as VideoGenerationJob };
    } catch (error) {
      console.error('Error in getJob:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
  
  async updateJobStatus(jobId: string, status: 'processing' | 'completed' | 'failed', result?: Record<string, unknown>, error?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient(this.supabaseUrl, this.supabaseKey);
      
      const { error: updateError } = await supabase
        .from('content.video_jobs')
        .update({
          status,
          result,
          error,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);
      
      if (updateError) {
        console.error('Error updating video job:', updateError);
        return { success: false, error: updateError.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error in updateJobStatus:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
  
  async listPendingJobs(): Promise<{ success: boolean; jobs?: VideoGenerationJob[]; error?: string }> {
    try {
      const supabase = createClient(this.supabaseUrl, this.supabaseKey);
      
      const { data, error } = await supabase
        .from('content.video_jobs')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error listing pending jobs:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true, jobs: data as VideoGenerationJob[] };
    } catch (error) {
      console.error('Error in listPendingJobs:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
}

export const videoQueueService = VideoQueueService.getInstance();
