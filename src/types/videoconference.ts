export interface VideoconferencePlatform {
  id: string;
  name: 'zoom' | 'teams' | 'bigbluebutton';
  display_name: string;
  api_key?: string;
  api_secret?: string;
  base_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VideoconferenceMeeting {
  id: string;
  title: string;
  description?: string;
  course_id?: string;
  instructor_id: string;
  platform_id: string;
  meeting_id: string;
  meeting_url: string;
  join_url: string;
  password?: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  recurring: boolean;
  recurrence_pattern?: RecurrencePattern;
  created_at?: string;
  updated_at?: string;
  platform?: VideoconferencePlatform;
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly';
  interval: number;
  days_of_week?: number[];
  day_of_month?: number;
  end_date?: string;
  occurrences?: number;
}

export interface VideoconferenceRecording {
  id: string;
  meeting_id: string;
  recording_id: string;
  recording_url: string;
  recording_type: 'video' | 'audio' | 'chat' | 'transcript';
  duration?: number;
  size?: number;
  status: 'processing' | 'completed' | 'failed';
  created_at?: string;
  updated_at?: string;
}

export interface VideoconferenceAttendance {
  id: string;
  meeting_id: string;
  user_id: string;
  join_time?: string;
  leave_time?: string;
  duration?: number;
  status: 'present' | 'absent' | 'late' | 'partial';
  created_at?: string;
  updated_at?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ZoomMeetingRequest {
  topic: string;
  type: number; // 1: instant, 2: scheduled, 3: recurring with no fixed time, 8: recurring with fixed time
  start_time: string;
  duration: number;
  timezone: string;
  password?: string;
  agenda?: string;
  settings?: {
    host_video?: boolean;
    participant_video?: boolean;
    join_before_host?: boolean;
    mute_upon_entry?: boolean;
    watermark?: boolean;
    use_pmi?: boolean;
    approval_type?: number;
    registration_type?: number;
    audio?: string;
    auto_recording?: string;
    waiting_room?: boolean;
  };
  recurrence?: {
    type: number;
    repeat_interval: number;
    weekly_days?: string;
    monthly_day?: number;
    end_times?: number;
    end_date_time?: string;
  };
}

export interface TeamsMeetingRequest {
  subject: string;
  startDateTime: string;
  endDateTime: string;
  participants?: {
    attendees?: Array<{ emailAddress: { address: string; name?: string } }>;
  };
  isOnlineMeeting: boolean;
  onlineMeetingProvider: 'teamsForBusiness';
}

export interface BigBlueButtonMeetingRequest {
  name: string;
  meetingID: string;
  attendeePW: string;
  moderatorPW: string;
  welcome?: string;
  logoutURL?: string;
  record?: boolean;
  duration?: number;
  meta_bbb_origin?: string;
  meta_bbb_origin_version?: string;
  meta_bbb_origin_server_name?: string;
}
