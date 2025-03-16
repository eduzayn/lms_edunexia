import { createClient } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '../supabase/server';
import { 
  VideoconferencePlatform, 
  VideoconferenceMeeting, 
  VideoconferenceRecording, 
  VideoconferenceAttendance
} from '../../types/videoconference';
import {
  createZoomMeeting,
  updateZoomMeeting,
  deleteZoomMeeting,
  getZoomRecordings,
  createTeamsMeeting,
  updateTeamsMeeting,
  deleteTeamsMeeting,
  getTeamsRecordings
} from './videoconference-zoom-teams-methods';
import {
  createBigBlueButtonMeeting,
  updateBigBlueButtonMeeting,
  deleteBigBlueButtonMeeting,
  getBigBlueButtonRecordings
} from './videoconference-bbb-methods';

/**
 * VideoconferenceService
 * 
 * Service for managing videoconference functionality including:
 * - Platform management (Zoom, Teams, BigBlueButton)
 * - Meeting creation, updating, and deletion
 * - Recording management
 * - Attendance tracking
 */
export class VideoconferenceService {
  private static instance: VideoconferenceService;
  private supabaseUrl: string;
  private supabaseKey: string;
  private supabase: ReturnType<typeof createClient>;

  private constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    this.supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  public static getInstance(): VideoconferenceService {
    if (!VideoconferenceService.instance) {
      VideoconferenceService.instance = new VideoconferenceService();
    }
    return VideoconferenceService.instance;
  }

  // Platform methods
  async getPlatforms() {
    try {
      const { data, error } = await this.supabase
        .from('videoconference.platforms')
        .select('*');

      if (error) {
        throw new Error(`Error fetching platforms: ${error.message}`);
      }

      return {
        success: true,
        platforms: data as unknown as VideoconferencePlatform[]
      };
    } catch (error) {
      console.error('Error in getPlatforms:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getPlatform(platformId: string) {
    try {
      const { data, error } = await this.supabase
        .from('videoconference.platforms')
        .select('*')
        .eq('id', platformId)
        .single();

      if (error) {
        throw new Error(`Error fetching platform: ${error.message}`);
      }

      return {
        success: true,
        platform: data as unknown as VideoconferencePlatform
      };
    } catch (error) {
      console.error('Error in getPlatform:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async updatePlatformSettings(platformId: string, settings: Partial<VideoconferencePlatform>) {
    try {
      const { data, error } = await this.supabase
        .from('videoconference.platforms')
        .update(settings)
        .eq('id', platformId)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating platform settings: ${error.message}`);
      }

      return {
        success: true,
        platform: data as unknown as VideoconferencePlatform
      };
    } catch (error) {
      console.error('Error in updatePlatformSettings:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Meeting methods
  async createMeeting(meeting: Omit<VideoconferenceMeeting, 'id' | 'created_at' | 'updated_at' | 'meeting_id' | 'meeting_url' | 'join_url'>) {
    try {
      // Get platform details
      const { platform, success } = await this.getPlatform(meeting.platform_id);
      
      if (!success || !platform) {
        throw new Error('Platform not found');
      }

      // Create meeting in the respective platform
      let externalMeeting;
      
      switch (platform.name) {
        case 'zoom':
          externalMeeting = await createZoomMeeting(meeting, platform);
          break;
        case 'teams':
          externalMeeting = await createTeamsMeeting(meeting, platform);
          break;
        case 'bigbluebutton':
          externalMeeting = await createBigBlueButtonMeeting(meeting, platform);
          break;
        default:
          throw new Error(`Unsupported platform: ${platform.name}`);
      }

      // Save meeting to database
      const { data, error } = await this.supabase
        .from('videoconference.meetings')
        .insert({
          ...meeting,
          meeting_id: externalMeeting.id,
          meeting_url: externalMeeting.host_url,
          join_url: externalMeeting.join_url,
          password: externalMeeting.password
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating meeting: ${error.message}`);
      }

      return {
        success: true,
        meeting: data as unknown as VideoconferenceMeeting
      };
    } catch (error) {
      console.error('Error in createMeeting:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getMeetings(courseId?: string, instructorId?: string) {
    try {
      let query = this.supabase
        .from('videoconference.meetings')
        .select(`
          *,
          platform:platform_id(*)
        `)
        .order('start_time', { ascending: true });

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      if (instructorId) {
        query = query.eq('instructor_id', instructorId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Error fetching meetings: ${error.message}`);
      }

      return {
        success: true,
        meetings: data as unknown as VideoconferenceMeeting[]
      };
    } catch (error) {
      console.error('Error in getMeetings:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getMeeting(meetingId: string) {
    try {
      const { data, error } = await this.supabase
        .from('videoconference.meetings')
        .select(`
          *,
          platform:platform_id(*)
        `)
        .eq('id', meetingId)
        .single();

      if (error) {
        throw new Error(`Error fetching meeting: ${error.message}`);
      }

      return {
        success: true,
        meeting: data as unknown as VideoconferenceMeeting
      };
    } catch (error) {
      console.error('Error in getMeeting:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async updateMeeting(meetingId: string, updates: Partial<VideoconferenceMeeting>) {
    try {
      // Get current meeting
      const { meeting, success } = await this.getMeeting(meetingId);
      
      if (!success || !meeting) {
        throw new Error('Meeting not found');
      }

      // Get platform details
      const { platform, success: platformSuccess } = await this.getPlatform(meeting.platform_id);
      
      if (!platformSuccess || !platform) {
        throw new Error('Platform not found');
      }

      // Update meeting in the respective platform
      switch (platform.name) {
        case 'zoom':
          await updateZoomMeeting(meeting, updates, platform);
          break;
        case 'teams':
          await updateTeamsMeeting(meeting, updates, platform);
          break;
        case 'bigbluebutton':
          await updateBigBlueButtonMeeting(meeting, updates, platform);
          break;
        default:
          throw new Error(`Unsupported platform: ${platform.name}`);
      }

      // Update meeting in database
      const { data, error } = await this.supabase
        .from('videoconference.meetings')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', meetingId)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating meeting: ${error.message}`);
      }

      return {
        success: true,
        meeting: data as unknown as VideoconferenceMeeting
      };
    } catch (error) {
      console.error('Error in updateMeeting:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async deleteMeeting(meetingId: string) {
    try {
      // Get current meeting
      const { meeting, success } = await this.getMeeting(meetingId);
      
      if (!success || !meeting) {
        throw new Error('Meeting not found');
      }

      // Get platform details
      const { platform, success: platformSuccess } = await this.getPlatform(meeting.platform_id);
      
      if (!platformSuccess || !platform) {
        throw new Error('Platform not found');
      }

      // Delete meeting in the respective platform
      switch (platform.name) {
        case 'zoom':
          await deleteZoomMeeting(meeting, platform);
          break;
        case 'teams':
          await deleteTeamsMeeting(meeting, platform);
          break;
        case 'bigbluebutton':
          await deleteBigBlueButtonMeeting(meeting, platform);
          break;
        default:
          throw new Error(`Unsupported platform: ${platform.name}`);
      }

      // Delete meeting from database
      const { error } = await this.supabase
        .from('videoconference.meetings')
        .delete()
        .eq('id', meetingId);

      if (error) {
        throw new Error(`Error deleting meeting: ${error.message}`);
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Error in deleteMeeting:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Recording methods
  async getRecordings(meetingId: string) {
    try {
      const { data, error } = await this.supabase
        .from('videoconference.recordings')
        .select('*')
        .eq('meeting_id', meetingId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Error fetching recordings: ${error.message}`);
      }

      return {
        success: true,
        recordings: data as unknown as VideoconferenceRecording[]
      };
    } catch (error) {
      console.error('Error in getRecordings:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async syncRecordings(meetingId: string) {
    try {
      // Get meeting details
      const { meeting, success } = await this.getMeeting(meetingId);
      
      if (!success || !meeting) {
        throw new Error('Meeting not found');
      }

      // Get platform details
      const { platform, success: platformSuccess } = await this.getPlatform(meeting.platform_id);
      
      if (!platformSuccess || !platform) {
        throw new Error('Platform not found');
      }

      // Get recordings from the respective platform
      let externalRecordings: any[] = [];
      
      switch (platform.name) {
        case 'zoom':
          externalRecordings = await getZoomRecordings(meeting, platform);
          break;
        case 'teams':
          externalRecordings = await getTeamsRecordings(meeting, platform);
          break;
        case 'bigbluebutton':
          externalRecordings = await getBigBlueButtonRecordings(meeting, platform);
          break;
        default:
          throw new Error(`Unsupported platform: ${platform.name}`);
      }

      // Save recordings to database
      const recordings: Omit<VideoconferenceRecording, 'id' | 'created_at' | 'updated_at'>[] = externalRecordings.map(rec => ({
        meeting_id: meetingId,
        recording_id: rec.id,
        recording_url: rec.url,
        recording_type: rec.type,
        duration: rec.duration,
        size: rec.size,
        status: 'completed'
      }));

      if (recordings.length > 0) {
        const { error } = await this.supabase
          .from('videoconference.recordings')
          .upsert(recordings, { onConflict: 'meeting_id,recording_id' });

        if (error) {
          throw new Error(`Error syncing recordings: ${error.message}`);
        }
      }

      return {
        success: true,
        count: recordings.length
      };
    } catch (error) {
      console.error('Error in syncRecordings:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Attendance methods
  async trackAttendance(meetingId: string, userId: string, status: VideoconferenceAttendance['status'], joinTime?: string, leaveTime?: string, duration?: number) {
    try {
      const { data, error } = await this.supabase
        .from('videoconference.attendance')
        .upsert({
          meeting_id: meetingId,
          user_id: userId,
          join_time: joinTime,
          leave_time: leaveTime,
          duration: duration,
          status: status
        }, { onConflict: 'meeting_id,user_id' })
        .select()
        .single();

      if (error) {
        throw new Error(`Error tracking attendance: ${error.message}`);
      }

      return {
        success: true,
        attendance: data as unknown as VideoconferenceAttendance
      };
    } catch (error) {
      console.error('Error in trackAttendance:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getAttendance(meetingId: string) {
    try {
      const { data, error } = await this.supabase
        .from('videoconference.attendance')
        .select(`
          *,
          user:user_id(id, name:profiles(full_name), email:profiles(email))
        `)
        .eq('meeting_id', meetingId);

      if (error) {
        throw new Error(`Error fetching attendance: ${error.message}`);
      }

      return {
        success: true,
        attendance: data as unknown as VideoconferenceAttendance[]
      };
    } catch (error) {
      console.error('Error in getAttendance:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getUserAttendance(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('videoconference.attendance')
        .select(`
          *,
          meeting:meeting_id(
            id, 
            title, 
            start_time, 
            end_time, 
            platform:platform_id(name, display_name)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Error fetching user attendance: ${error.message}`);
      }

      return {
        success: true,
        attendance: data
      };
    } catch (error) {
      console.error('Error in getUserAttendance:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const videoconferenceService = VideoconferenceService.getInstance();
