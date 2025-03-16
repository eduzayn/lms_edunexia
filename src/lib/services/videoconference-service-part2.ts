  // Helper methods for platform-specific implementations
  private async createBigBlueButtonMeeting(meeting: Omit<VideoconferenceMeeting, 'id' | 'created_at' | 'updated_at' | 'meeting_id' | 'meeting_url' | 'join_url'>, platform: VideoconferencePlatform) {
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
        duration: this.calculateDurationInMinutes(meeting.start_time, meeting.end_time)
      };

      // Generate checksum for BigBlueButton API
      const queryParams = this.objectToQueryString(bbbMeeting);
      const checksum = this.generateBBBChecksum('create', queryParams, platform.api_secret);

      // Call BigBlueButton API to create meeting
      const response = await axios.get(
        `${platform.base_url}/api/create?${queryParams}&checksum=${checksum}`
      );

      // Parse XML response
      const returnCode = this.getXmlElement(response.data, 'returncode');
      
      if (returnCode !== 'SUCCESS') {
        const message = this.getXmlElement(response.data, 'message');
        throw new Error(`Failed to create BigBlueButton meeting: ${message}`);
      }

      // Generate join URLs
      const moderatorJoinUrl = this.generateBBBJoinUrl(
        platform.base_url,
        meetingId,
        meeting.instructor_id,
        'Instructor',
        moderatorPW,
        platform.api_secret
      );

      const attendeeJoinUrl = this.generateBBBJoinUrl(
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

  private async updateBigBlueButtonMeeting(meeting: VideoconferenceMeeting, updates: Partial<VideoconferenceMeeting>, platform: VideoconferencePlatform) {
    try {
      // BigBlueButton doesn't support updating meetings directly
      // We need to end the current meeting and create a new one
      await this.deleteBigBlueButtonMeeting(meeting, platform);
      
      // Create a new meeting with updated details
      const newMeeting = await this.createBigBlueButtonMeeting({
        ...meeting,
        ...updates
      }, platform);

      return newMeeting;
    } catch (error) {
      console.error('Error in updateBigBlueButtonMeeting:', error);
      throw new Error(`Failed to update BigBlueButton meeting: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async deleteBigBlueButtonMeeting(meeting: VideoconferenceMeeting, platform: VideoconferencePlatform) {
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
      const queryParams = this.objectToQueryString(endParams);
      const checksum = this.generateBBBChecksum('end', queryParams, platform.api_secret);

      // Call BigBlueButton API to end meeting
      const response = await axios.get(
        `${platform.base_url}/api/end?${queryParams}&checksum=${checksum}`
      );

      // Parse XML response
      const returnCode = this.getXmlElement(response.data, 'returncode');
      
      if (returnCode !== 'SUCCESS') {
        const message = this.getXmlElement(response.data, 'message');
        throw new Error(`Failed to end BigBlueButton meeting: ${message}`);
      }

      return true;
    } catch (error) {
      console.error('Error in deleteBigBlueButtonMeeting:', error);
      throw new Error(`Failed to delete BigBlueButton meeting: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async getBigBlueButtonRecordings(meeting: VideoconferenceMeeting, platform: VideoconferencePlatform) {
    try {
      if (!platform.api_key || !platform.api_secret || !platform.base_url) {
        throw new Error('BigBlueButton API credentials not configured');
      }

      // Prepare get recordings request
      const recordingsParams = {
        meetingID: meeting.meeting_id
      };

      // Generate checksum for BigBlueButton API
      const queryParams = this.objectToQueryString(recordingsParams);
      const checksum = this.generateBBBChecksum('getRecordings', queryParams, platform.api_secret);

      // Call BigBlueButton API to get recordings
      const response = await axios.get(
        `${platform.base_url}/api/getRecordings?${queryParams}&checksum=${checksum}`
      );

      // Parse XML response
      const returnCode = this.getXmlElement(response.data, 'returncode');
      
      if (returnCode !== 'SUCCESS') {
        const message = this.getXmlElement(response.data, 'message');
        throw new Error(`Failed to get BigBlueButton recordings: ${message}`);
      }

      // Extract recordings from XML
      const recordings = this.getXmlElements(response.data, 'recording');
      
      // Transform BBB recordings to our format
      return recordings.map((recording: any) => {
        const recordId = this.getXmlElement(recording, 'recordID');
        const playbackUrl = this.getXmlElement(recording, 'playback/format/url');
        const duration = parseInt(this.getXmlElement(recording, 'duration'), 10);
        
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

  // Utility methods
  private getZoomJWT(apiKey: string, apiSecret: string): string {
    const payload = {
      iss: apiKey,
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    };

    return require('jsonwebtoken').sign(payload, apiSecret);
  }

  private calculateDurationInMinutes(startTime: string, endTime: string): number {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    return Math.ceil(durationMs / (1000 * 60)); // Convert ms to minutes and round up
  }

  private getZoomRecurrenceType(type: string): number {
    switch (type) {
      case 'daily':
        return 1;
      case 'weekly':
        return 2;
      case 'monthly':
        return 3;
      default:
        return 1;
    }
  }

  private objectToQueryString(obj: Record<string, any>): string {
    return Object.entries(obj)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
  }

  private generateBBBChecksum(action: string, queryString: string, secret: string): string {
    return crypto
      .createHash('sha1')
      .update(action + queryString + secret)
      .digest('hex');
  }

  private generateBBBJoinUrl(baseUrl: string, meetingId: string, userId: string, userName: string, password: string, secret: string): string {
    const params = {
      meetingID: meetingId,
      userID: userId,
      fullName: userName,
      password: password
    };

    const queryString = this.objectToQueryString(params);
    const checksum = this.generateBBBChecksum('join', queryString, secret);

    return `${baseUrl}/api/join?${queryString}&checksum=${checksum}`;
  }

  private getXmlElement(xml: string, path: string): string {
    const parts = path.split('/');
    let result = xml;

    for (const part of parts) {
      const regex = new RegExp(`<${part}[^>]*>(.*?)<\/${part}>`, 's');
      const match = result.match(regex);
      
      if (!match) {
        return '';
      }
      
      result = match[1];
    }

    return result.trim();
  }

  private getXmlElements(xml: string, element: string): any[] {
    const regex = new RegExp(`<${element}[^>]*>(.*?)<\/${element}>`, 'gs');
    const matches = [...xml.matchAll(regex)];
    
    return matches.map(match => match[0]);
  }
}

export const videoconferenceService = VideoconferenceService.getInstance();
export default videoconferenceService;
