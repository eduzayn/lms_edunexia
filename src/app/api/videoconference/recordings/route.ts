import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../lib/supabase/server';
import { videoconferenceService } from '../../../../lib/services/videoconference-service-fixed';

/**
 * GET /api/videoconference/recordings
 * 
 * Get recordings for a meeting
 * Query parameters:
 * - meeting_id: Meeting ID (required)
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

    if (!meetingId) {
      return NextResponse.json(
        { error: 'Missing required parameter: meeting_id' },
        { status: 400 }
      );
    }

    // Check if user has access to this meeting
    const { meeting, success } = await videoconferenceService.getMeeting(meetingId);
    
    if (!success || !meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    if (meeting.instructor_id !== user.id) {
      // Check if user is a student in the course
      if (meeting.course_id) {
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('*')
          .eq('course_id', meeting.course_id)
          .eq('user_id', user.id)
          .single();

        if (!enrollment) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      } else {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Get recordings
    const result = await videoconferenceService.getRecordings(meetingId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.recordings);
  } catch (error) {
    console.error('Error in GET /api/videoconference/recordings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/videoconference/recordings/sync
 * 
 * Sync recordings for a meeting from the platform
 * Body:
 * - meeting_id: Meeting ID (required)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.meeting_id) {
      return NextResponse.json(
        { error: 'Missing required field: meeting_id' },
        { status: 400 }
      );
    }

    // Check if user is the instructor of this meeting
    const { meeting, success } = await videoconferenceService.getMeeting(body.meeting_id);
    
    if (!success || !meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    if (meeting.instructor_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Sync recordings
    const result = await videoconferenceService.syncRecordings(body.meeting_id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error('Error in POST /api/videoconference/recordings/sync:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
