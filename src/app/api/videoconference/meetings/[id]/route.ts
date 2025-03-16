import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../../lib/supabase/server';
import { videoconferenceService } from '../../../../../lib/services/videoconference-service-fixed';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/videoconference/meetings/[id]
 * 
 * Get a specific meeting by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await videoconferenceService.getMeeting(params.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    if (!result.meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    // Check if user has access to this meeting
    if (result.meeting.instructor_id !== user.id) {
      // Check if user is a student in the course
      if (result.meeting.course_id) {
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('*')
          .eq('course_id', result.meeting.course_id)
          .eq('user_id', user.id)
          .single();

        if (!enrollment) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      } else {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    return NextResponse.json(result.meeting);
  } catch (error) {
    console.error(`Error in GET /api/videoconference/meetings/${params.id}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/videoconference/meetings/[id]
 * 
 * Update a meeting
 * Body:
 * - title: Meeting title (optional)
 * - description: Meeting description (optional)
 * - start_time: Start time (ISO string) (optional)
 * - end_time: End time (ISO string) (optional)
 * - recurring: Whether the meeting is recurring (optional)
 * - recurrence_pattern: Recurrence pattern (optional)
 * - status: Meeting status (optional)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is the instructor of this meeting
    const { meeting, success } = await videoconferenceService.getMeeting(params.id);
    
    if (!success || !meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    if (meeting.instructor_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Update meeting
    const result = await videoconferenceService.updateMeeting(params.id, {
      title: body.title,
      description: body.description,
      start_time: body.start_time,
      end_time: body.end_time,
      recurring: body.recurring,
      recurrence_pattern: body.recurrence_pattern,
      status: body.status,
      password: body.password
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.meeting);
  } catch (error) {
    console.error(`Error in PUT /api/videoconference/meetings/${params.id}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/videoconference/meetings/[id]
 * 
 * Delete a meeting
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is the instructor of this meeting
    const { meeting, success } = await videoconferenceService.getMeeting(params.id);
    
    if (!success || !meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    if (meeting.instructor_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete meeting
    const result = await videoconferenceService.deleteMeeting(params.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error in DELETE /api/videoconference/meetings/${params.id}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
