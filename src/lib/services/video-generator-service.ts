import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { videoQueueService } from './video-queue-service';

interface VideoGenerationRequest {
  title: string;
  description: string;
  script?: string;
  duration?: number; // in seconds
  style?: 'educational' | 'professional' | 'casual';
  voiceType?: 'male' | 'female';
  includeSubtitles?: boolean;
  courseId?: string;
  lessonId?: string;
}

interface VideoMetadata {
  id?: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl?: string;
  videoUrl: string;
  scriptText: string;
  subtitlesUrl?: string;
  status: 'processing' | 'completed' | 'failed';
  createdBy: string;
  courseId?: string;
  lessonId?: string;
  created_at?: string;
}

export class VideoGeneratorService {
  private static instance: VideoGeneratorService;
  private supabaseUrl: string;
  private supabaseKey: string;
  private openaiKey: string;
  private elevenlabsKey: string;
  private openai: OpenAI | null = null;

  private constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    this.openaiKey = process.env.OPENAI_API_KEY || '';
    this.elevenlabsKey = process.env.ELEVENLABS_API_KEY || '';
    
    if (this.openaiKey) {
      this.openai = new OpenAI({
        apiKey: this.openaiKey
      });
    }
  }

  public static getInstance(): VideoGeneratorService {
    if (!VideoGeneratorService.instance) {
      VideoGeneratorService.instance = new VideoGeneratorService();
    }
    return VideoGeneratorService.instance;
  }

  async generateVideoScript(request: VideoGenerationRequest): Promise<{ success: boolean; script?: string; error?: string }> {
    try {
      if (!this.openai) {
        return { 
          success: false, 
          error: 'OpenAI API key not configured' 
        };
      }

      // If script is already provided, just return it
      if (request.script) {
        return { success: true, script: request.script };
      }

      // Generate script based on title and description
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em criar roteiros para vídeos educacionais. 
            Seu objetivo é criar um roteiro claro, envolvente e educativo que será usado para gerar um vídeo.
            
            O roteiro deve:
            1. Ter uma introdução clara que apresente o tópico
            2. Explicar os conceitos principais de forma didática
            3. Usar linguagem simples e direta
            4. Incluir exemplos práticos quando apropriado
            5. Ter uma conclusão que resuma os pontos principais
            
            Formate o roteiro para ser falado em voz alta, com pausas naturais e transições suaves.
            Use português do Brasil formal, mas acessível.`
          },
          {
            role: 'user',
            content: `Crie um roteiro para um vídeo educacional com o título: "${request.title}"
            
            Descrição do vídeo: ${request.description}
            
            Estilo: ${request.style || 'educational'}
            Duração aproximada: ${request.duration || 180} segundos
            
            Por favor, crie um roteiro completo que possa ser narrado para este vídeo.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const script = response.choices[0]?.message?.content || '';
      
      return { success: true, script };
    } catch (error) {
      console.error('Error in generateVideoScript:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async generateAudioFromScript(script: string): Promise<{ success: boolean; audioUrl?: string; error?: string }> {
    try {
      // In a real implementation, this would call the ElevenLabs API with the script parameter
      // For now, we'll return a mock audio URL
      console.log(`Generating audio for script: ${script.substring(0, 50)}...`);
      
      // Mock implementation - in production this would call ElevenLabs API
      const mockAudioUrl = 'https://storage.googleapis.com/edunexia-videos/audio/sample-narration.mp3';
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, audioUrl: mockAudioUrl };
    } catch (error) {
      console.error('Error in generateAudioFromScript:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async generateVideoWithAudio(audioUrl: string, title: string): Promise<{ success: boolean; videoUrl?: string; thumbnailUrl?: string; error?: string }> {
    try {
      // In a real implementation, this would generate video content to match the audio
      // For now, we'll return mock URLs
      console.log(`Generating video for audio: ${audioUrl} with title: ${title}`);
      
      // Mock implementation - in production this would generate actual video
      const mockVideoUrl = 'https://storage.googleapis.com/edunexia-videos/video/sample-video.mp4';
      const mockThumbnailUrl = 'https://storage.googleapis.com/edunexia-videos/thumbnails/sample-thumbnail.jpg';
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { 
        success: true, 
        videoUrl: mockVideoUrl,
        thumbnailUrl: mockThumbnailUrl
      };
    } catch (error) {
      console.error('Error in generateVideoWithAudio:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async generateSubtitles(audioUrl: string): Promise<{ success: boolean; subtitlesUrl?: string; error?: string }> {
    try {
      // In a real implementation, this would generate subtitles from the audio
      // For now, we'll return a mock URL
      console.log(`Generating subtitles for audio: ${audioUrl}`);
      
      // Mock implementation - in production this would generate actual subtitles
      const mockSubtitlesUrl = 'https://storage.googleapis.com/edunexia-videos/subtitles/sample-subtitles.vtt';
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, subtitlesUrl: mockSubtitlesUrl };
    } catch (error) {
      console.error('Error in generateSubtitles:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async saveVideoMetadata(metadata: VideoMetadata): Promise<{ success: boolean; data?: VideoMetadata; error?: string }> {
    try {
      const supabase = createClient(this.supabaseUrl, this.supabaseKey);
      
      const { data, error } = metadata.id 
        ? await supabase
            .from('content.videos')
            .update({
              title: metadata.title,
              description: metadata.description,
              duration: metadata.duration,
              thumbnail_url: metadata.thumbnailUrl,
              video_url: metadata.videoUrl,
              script_text: metadata.scriptText,
              subtitles_url: metadata.subtitlesUrl,
              status: metadata.status,
              course_id: metadata.courseId,
              lesson_id: metadata.lessonId,
              updated_at: new Date().toISOString()
            })
            .eq('id', metadata.id)
            .select()
            .single()
        : await supabase
            .from('content.videos')
            .insert({
              title: metadata.title,
              description: metadata.description,
              duration: metadata.duration,
              thumbnail_url: metadata.thumbnailUrl,
              video_url: metadata.videoUrl,
              script_text: metadata.scriptText,
              subtitles_url: metadata.subtitlesUrl,
              status: metadata.status,
              created_by: metadata.createdBy,
              course_id: metadata.courseId,
              lesson_id: metadata.lessonId
            })
            .select()
            .single();
      
      if (error) {
        console.error('Error saving video metadata:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true, data: data as VideoMetadata };
    } catch (error) {
      console.error('Error in saveVideoMetadata:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async getVideo(videoId: string): Promise<{ success: boolean; data?: VideoMetadata; error?: string }> {
    try {
      const supabase = createClient(this.supabaseUrl, this.supabaseKey);
      
      const { data, error } = await supabase
        .from('content.videos')
        .select('*')
        .eq('id', videoId)
        .single();
      
      if (error) {
        console.error('Error fetching video:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true, data: data as VideoMetadata };
    } catch (error) {
      console.error('Error in getVideo:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async listVideos(courseId?: string, createdBy?: string): Promise<{ success: boolean; data?: VideoMetadata[]; error?: string }> {
    try {
      const supabase = createClient(this.supabaseUrl, this.supabaseKey);
      
      let query = supabase.from('content.videos').select('*');
      
      if (courseId) {
        query = query.eq('course_id', courseId);
      }
      
      if (createdBy) {
        query = query.eq('created_by', createdBy);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error listing videos:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true, data: data as VideoMetadata[] };
    } catch (error) {
      console.error('Error in listVideos:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async deleteVideo(videoId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient(this.supabaseUrl, this.supabaseKey);
      
      const { error } = await supabase
        .from('content.videos')
        .delete()
        .eq('id', videoId);
      
      if (error) {
        console.error('Error deleting video:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error in deleteVideo:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

 async generateVideo(request: VideoGenerationRequest, userId: string): Promise<{ success: boolean; videoId?: string; jobId?: string; error?: string }> {
    try {
      // Create a job in the queue
      const jobResult = await videoQueueService.createJob(userId, request);
      
      if (!jobResult.success || !jobResult.jobId) {
        return { success: false, error: jobResult.error || 'Failed to create video generation job' };
      }
      
      // Return the job ID immediately
      return { success: true, jobId: jobResult.jobId };
      
      // Note: The actual video generation will be handled by a background process
    } catch (error) {
      console.error('Error in generateVideo:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
  
  async processNextJob(): Promise<{ success: boolean; videoId?: string; error?: string }> {
    try {
      // Get the next pending job
      const jobsResult = await videoQueueService.listPendingJobs();
      
      if (!jobsResult.success || !jobsResult.jobs || jobsResult.jobs.length === 0) {
        return { success: true }; // No jobs to process
      }
      
      const job = jobsResult.jobs[0];
      
      // Update job status to processing
      await videoQueueService.updateJobStatus(job.id, 'processing');
      
      const request = job.request as VideoGenerationRequest;
      
      // Step 1: Generate script if not provided
      const scriptResult = await this.generateVideoScript(request);
      if (!scriptResult.success || !scriptResult.script) {
        await videoQueueService.updateJobStatus(job.id, 'failed', null, scriptResult.error || 'Failed to generate script');
        return { success: false, error: scriptResult.error || 'Failed to generate script' };
      }
      
      // Step 2: Generate audio from script
      // Pass only the script parameter since we updated the method signature
      const audioResult = await this.generateAudioFromScript(scriptResult.script);
      if (!audioResult.success || !audioResult.audioUrl) {
        await videoQueueService.updateJobStatus(job.id, 'failed', null, audioResult.error || 'Failed to generate audio');
        return { success: false, error: audioResult.error || 'Failed to generate audio' };
      }
      
      // Step 3: Generate video with audio
      // Pass only the required parameters since we updated the method signature
      const videoResult = await this.generateVideoWithAudio(audioResult.audioUrl, request.title);
      if (!videoResult.success || !videoResult.videoUrl) {
        await videoQueueService.updateJobStatus(job.id, 'failed', null, videoResult.error || 'Failed to generate video');
        return { success: false, error: videoResult.error || 'Failed to generate video' };
      }
      
      // Step 4: Generate subtitles if requested
      let subtitlesUrl = undefined;
      if (request.includeSubtitles) {
        // Pass only the audioUrl parameter since we updated the method signature
        const subtitlesResult = await this.generateSubtitles(audioResult.audioUrl);
        if (subtitlesResult.success && subtitlesResult.subtitlesUrl) {
          subtitlesUrl = subtitlesResult.subtitlesUrl;
        }
      }
      
      // Step 5: Save video metadata
      const metadataResult = await this.saveVideoMetadata({
        title: request.title,
        description: request.description,
        duration: request.duration || 180,
        thumbnailUrl: videoResult.thumbnailUrl,
        videoUrl: videoResult.videoUrl,
        scriptText: scriptResult.script,
        subtitlesUrl: subtitlesUrl,
        status: 'completed',
        createdBy: job.userId,
        courseId: request.courseId,
        lessonId: request.lessonId
      });
      
      if (!metadataResult.success || !metadataResult.data) {
        await videoQueueService.updateJobStatus(job.id, 'failed', null, metadataResult.error || 'Failed to save video metadata');
        return { success: false, error: metadataResult.error || 'Failed to save video metadata' };
      }
      
      // Update job status to completed
      await videoQueueService.updateJobStatus(job.id, 'completed', { videoId: metadataResult.data.id });
      
      return { success: true, videoId: metadataResult.data.id };
    } catch (error) {
      console.error('Error in processNextJob:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
}

export const videoGeneratorService = VideoGeneratorService.getInstance();
