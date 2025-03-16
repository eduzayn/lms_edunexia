import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../lib/supabase/server';
import { videoconferenceService } from '../../../../lib/services/videoconference-service-fixed';

/**
 * GET /api/videoconference/attendance
 * 
 * Get attendance for a meeting or user
 * Query parameters:
 * - meeting_id: Meeting ID (optional)
 * - user_id: User ID (optional)
 * 
 * At least one of meeting_id or user_id must be provided
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const meetingId = url.searchParams.get('meeting_id');
    const userId = url.searchParams.get('user_id');

    if (!meetingId && !userId) {
      return NextResponse.json(
        { error: 'Missing required parameter: meeting_id or user_id' },
        { status: 400 }
      );
    }

    if (meetingId) {
      // Check if user has access to this meeting
      const { meeting, success } = await videoconferenceService.getMeeting(meetingId);
      
      if (!success || !meeting) {
        return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
      }

      if (meeting.instructor_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // Get attendance for meeting
      const result = await videoconferenceService.getAttendance(meetingId);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json(result.attendance);
    } else if (userId) {
      // Check if user is requesting their own attendance or is an admin
      if (userId !== user.id) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (!userProfile || userProfile.role !== 'admin') {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      }

      // Get attendance for user
      const result = await videoconferenceService.getUserAttendance(userId);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json(result.attendance);
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error in GET /api/videoconference/attendance:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/videoconference/attendance
 * 
 * Track attendance for a meeting
 * Body:
 * - meeting_id: Meeting ID (required)
 * - user_id: User ID (required)
 * - status: Attendance status (required)
 * - join_time: Join time (ISO string) (optional)
 * - leave_time: Leave time (ISO string) (optional)
 * - duration: Duration in seconds (optional)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['meeting_id', 'user_id', 'status'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if user is the instructor of this meeting or the user being tracked
    const { meeting, success } = await videoconferenceService.getMeeting(body.meeting_id);
    
    if (!success || !meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    if (meeting.instructor_id !== user.id && body.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Track attendance
    const result = await videoconferenceService.trackAttendance(
      body.meeting_id,
      body.user_id,
      body.status,
      body.join_time,
      body.leave_time,
      body.duration
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.attendance, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/videoconference/attendance:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
