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
  getBigBlueButtonRecordings,
  getBigBlueButtonAttendance
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
/**
 * VideoconferenceService
 * 
 * Service for managing videoconference functionality including:
 * - Platform management (Zoom, Teams, BigBlueButton)
 * - Meeting creation, updating, and deletion
 * - Recording management
 * - Attendance tracking
 */
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
        platform: data as VideoconferencePlatform
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
        platform: data as VideoconferencePlatform
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
