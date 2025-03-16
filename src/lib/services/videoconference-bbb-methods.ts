import axios from 'axios';
import { 
  VideoconferenceMeeting, 
  VideoconferencePlatform,
  BigBlueButtonMeetingRequest
} from '../../types/videoconference';
import {
  calculateDurationInMinutes,
  objectToQueryString,
  generateBBBChecksum,
  generateBBBJoinUrl,
  getXmlElement,
  getXmlElements
} from './videoconference-helpers';

// BigBlueButton specific methods
export async function createBigBlueButtonMeeting(
  meeting: Omit<VideoconferenceMeeting, 'id' | 'created_at' | 'updated_at' | 'meeting_id' | 'meeting_url' | 'join_url'>, 
  platform: VideoconferencePlatform
) {
  try {
    if (!platform.api_key || !platform.api_secret || !platform.base_url) {
      throw new Error('BigBlueButton API credentials not configured');
    }

    // Generate a unique meeting ID
    const meetingId = `bbb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    
    // Generate random passwords
    const attendeePW = Math.random().toString(36).substring(2, 10);
    const moderatorPW = Math.random().toString(36).substring(2, 10);

    // Prepare meeting request
    const bbbMeeting: BigBlueButtonMeetingRequest = {
      name: meeting.title,
      meetingID: meetingId,
      attendeePW: attendeePW,
      moderatorPW: moderatorPW,
      welcome: meeting.description,
      record: true,
      duration: calculateDurationInMinutes(meeting.start_time, meeting.end_time)
    };

    // Generate checksum for BigBlueButton API
    const queryParams = objectToQueryString(bbbMeeting);
    const checksum = generateBBBChecksum('create', queryParams, platform.api_secret);

    // Call BigBlueButton API to create meeting
    const response = await axios.get(
      `${platform.base_url}/api/create?${queryParams}&checksum=${checksum}`
    );

    // Parse XML response
    const returnCode = getXmlElement(response.data, 'returncode');
    
    if (returnCode !== 'SUCCESS') {
      const message = getXmlElement(response.data, 'message');
      throw new Error(`Failed to create BigBlueButton meeting: ${message}`);
    }

    // Generate join URLs
    const moderatorJoinUrl = generateBBBJoinUrl(
      platform.base_url,
      meetingId,
      meeting.instructor_id,
      'Instructor',
      moderatorPW,
      platform.api_secret
    );

    const attendeeJoinUrl = generateBBBJoinUrl(
      platform.base_url,
      meetingId,
      'student',
      'Student',
      attendeePW,
      platform.api_secret
    );

    return {
      id: meetingId,
      host_url: moderatorJoinUrl,
      join_url: attendeeJoinUrl,
      password: attendeePW
    };
  } catch (error) {
    console.error('Error in createBigBlueButtonMeeting:', error);
    throw new Error(`Failed to create BigBlueButton meeting: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateBigBlueButtonMeeting(
  meeting: VideoconferenceMeeting, 
  updates: Partial<VideoconferenceMeeting>, 
  platform: VideoconferencePlatform
) {
  try {
    // BigBlueButton doesn't support updating meetings directly
    // We need to end the current meeting and create a new one
    await deleteBigBlueButtonMeeting(meeting, platform);
    
    // Create a new meeting with updated details
    const newMeeting = await createBigBlueButtonMeeting({
      ...meeting,
      ...updates
    }, platform);

    return newMeeting;
  } catch (error) {
    console.error('Error in updateBigBlueButtonMeeting:', error);
    throw new Error(`Failed to update BigBlueButton meeting: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteBigBlueButtonMeeting(
  meeting: VideoconferenceMeeting, 
  platform: VideoconferencePlatform
) {
  try {
    if (!platform.api_key || !platform.api_secret || !platform.base_url) {
      throw new Error('BigBlueButton API credentials not configured');
    }

    // Prepare end meeting request
    const endParams = {
      meetingID: meeting.meeting_id,
      password: meeting.password
    };

    // Generate checksum for BigBlueButton API
    const queryParams = objectToQueryString(endParams);
    const checksum = generateBBBChecksum('end', queryParams, platform.api_secret);

    // Call BigBlueButton API to end meeting
    const response = await axios.get(
      `${platform.base_url}/api/end?${queryParams}&checksum=${checksum}`
    );

    // Parse XML response
    const returnCode = getXmlElement(response.data, 'returncode');
    
    if (returnCode !== 'SUCCESS') {
      const message = getXmlElement(response.data, 'message');
      throw new Error(`Failed to end BigBlueButton meeting: ${message}`);
    }

    return true;
  } catch (error) {
    console.error('Error in deleteBigBlueButtonMeeting:', error);
    throw new Error(`Failed to delete BigBlueButton meeting: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getBigBlueButtonRecordings(
  meeting: VideoconferenceMeeting, 
  platform: VideoconferencePlatform
) {
  try {
    if (!platform.api_key || !platform.api_secret || !platform.base_url) {
      throw new Error('BigBlueButton API credentials not configured');
    }

    // Prepare get recordings request
    const recordingsParams = {
      meetingID: meeting.meeting_id
    };

    // Generate checksum for BigBlueButton API
    const queryParams = objectToQueryString(recordingsParams);
    const checksum = generateBBBChecksum('getRecordings', queryParams, platform.api_secret);

    // Call BigBlueButton API to get recordings
    const response = await axios.get(
      `${platform.base_url}/api/getRecordings?${queryParams}&checksum=${checksum}`
    );

    // Parse XML response
    const returnCode = getXmlElement(response.data, 'returncode');
    
    if (returnCode !== 'SUCCESS') {
      const message = getXmlElement(response.data, 'message');
      throw new Error(`Failed to get BigBlueButton recordings: ${message}`);
    }

    // Extract recordings from XML
    const recordings = getXmlElements(response.data, 'recording');
    
    // Transform BBB recordings to our format
    return recordings.map((recording: any) => {
      const recordId = getXmlElement(recording, 'recordID');
      const playbackUrl = getXmlElement(recording, 'playback/format/url');
      const duration = parseInt(getXmlElement(recording, 'duration'), 10);
      
      return {
        id: recordId,
        url: playbackUrl,
        type: 'video',
        duration: duration,
        size: null
      };
    });
  } catch (error) {
    console.error('Error in getBigBlueButtonRecordings:', error);
    throw new Error(`Failed to get BigBlueButton recordings: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
