import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../lib/supabase/server';
import { videoconferenceService } from '../../../../lib/services/videoconference-service-fixed';

/**
 * GET /api/videoconference/meetings
 * 
 * Get all meetings for the authenticated user
 * Query parameters:
 * - course_id: Filter by course ID
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const courseId = url.searchParams.get('course_id');

    const result = await videoconferenceService.getMeetings(
      courseId || undefined,
      user.id
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.meetings);
  } catch (error) {
    console.error('Error in GET /api/videoconference/meetings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/videoconference/meetings
 * 
 * Create a new meeting
 * Body:
 * - title: Meeting title
 * - description: Meeting description
 * - platform_id: Platform ID
 * - start_time: Start time (ISO string)
 * - end_time: End time (ISO string)
 * - course_id: Course ID (optional)
 * - recurring: Whether the meeting is recurring (optional)
 * - recurrence_pattern: Recurrence pattern (optional)
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
    const requiredFields = ['title', 'platform_id', 'start_time', 'end_time'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create meeting
    const result = await videoconferenceService.createMeeting({
      title: body.title,
      description: body.description,
      platform_id: body.platform_id,
      instructor_id: user.id,
      start_time: body.start_time,
      end_time: body.end_time,
      course_id: body.course_id,
      recurring: body.recurring || false,
      recurrence_pattern: body.recurrence_pattern,
      status: 'scheduled',
      password: body.password
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.meeting, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/videoconference/meetings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
