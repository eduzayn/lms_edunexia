import axios from 'axios';
import { 
  VideoconferenceMeeting, 
  VideoconferencePlatform,
  ZoomMeetingRequest,
  TeamsMeetingRequest
} from '../../types/videoconference';
import {
  getZoomJWT,
  getZoomRecurrenceType,
  calculateDurationInMinutes
} from './videoconference-helpers';

/**
 * Zoom specific methods for videoconference service
 */

export async function createZoomMeeting(
  meeting: Omit<VideoconferenceMeeting, 'id' | 'created_at' | 'updated_at' | 'meeting_id' | 'meeting_url' | 'join_url'>, 
  platform: VideoconferencePlatform
) {
  try {
    if (!platform.api_key || !platform.api_secret) {
      throw new Error('Zoom API credentials not configured');
    }

    // Get JWT token for Zoom API
    const token = getZoomJWT(platform.api_key, platform.api_secret);

    // Prepare meeting request
    const zoomMeeting: ZoomMeetingRequest = {
      topic: meeting.title,
      type: meeting.recurring ? 8 : 2, // 2 = scheduled, 8 = recurring with fixed time
      start_time: meeting.start_time,
      duration: calculateDurationInMinutes(meeting.start_time, meeting.end_time),
      timezone: 'America/Sao_Paulo',
      password: meeting.password,
      agenda: meeting.description,
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        auto_recording: 'cloud'
      }
    };

    if (meeting.recurring && meeting.recurrence_pattern) {
      zoomMeeting.recurrence = {
        type: getZoomRecurrenceType(meeting.recurrence_pattern.type),
        repeat_interval: meeting.recurrence_pattern.interval
      };

      if (meeting.recurrence_pattern.type === 'weekly' && meeting.recurrence_pattern.days_of_week) {
        zoomMeeting.recurrence.weekly_days = meeting.recurrence_pattern.days_of_week.join(',');
      }

      if (meeting.recurrence_pattern.type === 'monthly' && meeting.recurrence_pattern.day_of_month) {
        zoomMeeting.recurrence.monthly_day = meeting.recurrence_pattern.day_of_month;
      }

      if (meeting.recurrence_pattern.end_date) {
        zoomMeeting.recurrence.end_date_time = meeting.recurrence_pattern.end_date;
      }

      if (meeting.recurrence_pattern.occurrences) {
        zoomMeeting.recurrence.end_times = meeting.recurrence_pattern.occurrences;
      }
    }

    // Call Zoom API to create meeting
    const response = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      zoomMeeting,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      id: response.data.id,
      host_url: response.data.start_url,
      join_url: response.data.join_url,
      password: response.data.password
    };
  } catch (error) {
    console.error('Error in createZoomMeeting:', error);
    throw new Error(`Failed to create Zoom meeting: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateZoomMeeting(
  meeting: VideoconferenceMeeting, 
  updates: Partial<VideoconferenceMeeting>, 
  platform: VideoconferencePlatform
) {
  try {
    if (!platform.api_key || !platform.api_secret) {
      throw new Error('Zoom API credentials not configured');
    }

    // Get JWT token for Zoom API
    const token = getZoomJWT(platform.api_key, platform.api_secret);

    // Prepare meeting update request
    const updateData: Partial<ZoomMeetingRequest> = {};

    if (updates.title) {
      updateData.topic = updates.title;
    }

    if (updates.description) {
      updateData.agenda = updates.description;
    }

    if (updates.start_time) {
      updateData.start_time = updates.start_time;
    }

    if (updates.end_time && updates.start_time) {
      updateData.duration = calculateDurationInMinutes(updates.start_time, updates.end_time);
    } else if (updates.end_time && meeting.start_time) {
      updateData.duration = calculateDurationInMinutes(meeting.start_time, updates.end_time);
    }

    if (updates.password) {
      updateData.password = updates.password;
    }

    if (updates.recurring !== undefined) {
      updateData.type = updates.recurring ? 8 : 2;
    }

    if (updates.recurrence_pattern) {
      updateData.recurrence = {
        type: getZoomRecurrenceType(updates.recurrence_pattern.type),
        repeat_interval: updates.recurrence_pattern.interval
      };

      if (updates.recurrence_pattern.type === 'weekly' && updates.recurrence_pattern.days_of_week) {
        updateData.recurrence.weekly_days = updates.recurrence_pattern.days_of_week.join(',');
      }

      if (updates.recurrence_pattern.type === 'monthly' && updates.recurrence_pattern.day_of_month) {
        updateData.recurrence.monthly_day = updates.recurrence_pattern.day_of_month;
      }

      if (updates.recurrence_pattern.end_date) {
        updateData.recurrence.end_date_time = updates.recurrence_pattern.end_date;
      }

      if (updates.recurrence_pattern.occurrences) {
        updateData.recurrence.end_times = updates.recurrence_pattern.occurrences;
      }
    }

    // Call Zoom API to update meeting
    await axios.patch(
      `https://api.zoom.us/v2/meetings/${meeting.meeting_id}`,
      updateData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return true;
  } catch (error) {
    console.error('Error in updateZoomMeeting:', error);
    throw new Error(`Failed to update Zoom meeting: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteZoomMeeting(
  meeting: VideoconferenceMeeting, 
  platform: VideoconferencePlatform
) {
  try {
    if (!platform.api_key || !platform.api_secret) {
      throw new Error('Zoom API credentials not configured');
    }

    // Get JWT token for Zoom API
    const token = getZoomJWT(platform.api_key, platform.api_secret);

    // Call Zoom API to delete meeting
    await axios.delete(
      `https://api.zoom.us/v2/meetings/${meeting.meeting_id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          schedule_for_reminder: false
        }
      }
    );

    return true;
  } catch (error) {
    console.error('Error in deleteZoomMeeting:', error);
    throw new Error(`Failed to delete Zoom meeting: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getZoomRecordings(
  meeting: VideoconferenceMeeting, 
  platform: VideoconferencePlatform
) {
  try {
    if (!platform.api_key || !platform.api_secret) {
      throw new Error('Zoom API credentials not configured');
    }

    // Get JWT token for Zoom API
    const token = getZoomJWT(platform.api_key, platform.api_secret);

    // Call Zoom API to get recordings
    const response = await axios.get(
      `https://api.zoom.us/v2/meetings/${meeting.meeting_id}/recordings`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Transform Zoom recordings to our format
    return response.data.recording_files.map((recording: any) => ({
      id: recording.id,
      url: recording.download_url,
      type: recording.recording_type === 'shared_screen_with_speaker_view' ? 'video' : recording.recording_type,
      duration: recording.duration,
      size: recording.file_size
    }));
  } catch (error) {
    console.error('Error in getZoomRecordings:', error);
    throw new Error(`Failed to get Zoom recordings: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Microsoft Teams specific methods for videoconference service
 */

export async function createTeamsMeeting(
  meeting: Omit<VideoconferenceMeeting, 'id' | 'created_at' | 'updated_at' | 'meeting_id' | 'meeting_url' | 'join_url'>, 
  platform: VideoconferencePlatform
) {
  try {
    if (!platform.api_key) {
      throw new Error('Microsoft Teams API credentials not configured');
    }

    // Prepare meeting request
    const teamsMeeting: TeamsMeetingRequest = {
      subject: meeting.title,
      startDateTime: meeting.start_time,
      endDateTime: meeting.end_time,
      isOnlineMeeting: true,
      onlineMeetingProvider: 'teamsForBusiness'
    };

    // Call Microsoft Graph API to create meeting
    const response = await axios.post(
      'https://graph.microsoft.com/v1.0/me/events',
      teamsMeeting,
      {
        headers: {
          'Authorization': `Bearer ${platform.api_key}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      id: response.data.id,
      host_url: response.data.onlineMeeting.joinUrl,
      join_url: response.data.onlineMeeting.joinUrl,
      password: null
    };
  } catch (error) {
    console.error('Error in createTeamsMeeting:', error);
    throw new Error(`Failed to create Teams meeting: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateTeamsMeeting(
  meeting: VideoconferenceMeeting, 
  updates: Partial<VideoconferenceMeeting>, 
  platform: VideoconferencePlatform
) {
  try {
    if (!platform.api_key) {
      throw new Error('Microsoft Teams API credentials not configured');
    }

    // Prepare meeting update request
    const updateData: Partial<TeamsMeetingRequest> = {};

    if (updates.title) {
      updateData.subject = updates.title;
    }

    if (updates.start_time) {
      updateData.startDateTime = updates.start_time;
    }

    if (updates.end_time) {
      updateData.endDateTime = updates.end_time;
    }

    // Call Microsoft Graph API to update meeting
    await axios.patch(
      `https://graph.microsoft.com/v1.0/me/events/${meeting.meeting_id}`,
      updateData,
      {
        headers: {
          'Authorization': `Bearer ${platform.api_key}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return true;
  } catch (error) {
    console.error('Error in updateTeamsMeeting:', error);
    throw new Error(`Failed to update Teams meeting: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteTeamsMeeting(
  meeting: VideoconferenceMeeting, 
  platform: VideoconferencePlatform
) {
  try {
    if (!platform.api_key) {
      throw new Error('Microsoft Teams API credentials not configured');
    }

    // Call Microsoft Graph API to delete meeting
    await axios.delete(
      `https://graph.microsoft.com/v1.0/me/events/${meeting.meeting_id}`,
      {
        headers: {
          'Authorization': `Bearer ${platform.api_key}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return true;
  } catch (error) {
    console.error('Error in deleteTeamsMeeting:', error);
    throw new Error(`Failed to delete Teams meeting: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getTeamsRecordings(
  meeting: VideoconferenceMeeting, 
  platform: VideoconferencePlatform
) {
  try {
    if (!platform.api_key) {
      throw new Error('Microsoft Teams API credentials not configured');
    }

    // Call Microsoft Graph API to get recordings
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/onlineMeetings/${meeting.meeting_id}/recordings`,
      {
        headers: {
          'Authorization': `Bearer ${platform.api_key}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Transform Teams recordings to our format
    return response.data.value.map((recording: any) => ({
      id: recording.id,
      url: recording.accessUrl,
      type: 'video',
      duration: recording.duration,
      size: null
    }));
  } catch (error) {
    console.error('Error in getTeamsRecordings:', error);
    throw new Error(`Failed to get Teams recordings: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
