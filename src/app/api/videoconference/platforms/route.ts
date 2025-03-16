import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../lib/supabase/server';
import { videoconferenceService } from '../../../../lib/services/videoconference-service-fixed';

/**
 * GET /api/videoconference/platforms
 * 
 * Get all available videoconference platforms
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await videoconferenceService.getPlatforms();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.platforms);
  } catch (error) {
    console.error('Error in GET /api/videoconference/platforms:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/videoconference/platforms/[id]
 * 
 * Update platform settings (admin only)
 * Body:
 * - api_key: API key (optional)
 * - api_secret: API secret (optional)
 * - base_url: Base URL (optional)
 * - display_name: Display name (optional)
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is an admin
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userProfile || userProfile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    // Update platform settings
    const result = await videoconferenceService.updatePlatformSettings(body.id, {
      api_key: body.api_key,
      api_secret: body.api_secret,
      base_url: body.base_url,
      display_name: body.display_name
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.platform);
  } catch (error) {
    console.error('Error in PUT /api/videoconference/platforms:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
