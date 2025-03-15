import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../lib/supabase/server';
import { scormService } from '../../../../lib/services/scorm-service';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const body = await request.json();
    
    const { contentId, scormPackageId, trackingData } = body;
    
    if (!contentId || !scormPackageId || !trackingData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Save SCORM tracking data
    const result = await scormService.saveScormTrackingData({
      user_id: userId,
      content_id: contentId,
      scorm_package_id: scormPackageId,
      ...trackingData
    });
    
    // Update analytics
    if (trackingData.completion_status) {
      await scormService.trackScormCompletion(
        userId, 
        contentId, 
        trackingData.completion_status
      );
    }
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error saving SCORM tracking data:', error);
    return NextResponse.json({ error: 'Failed to save tracking data' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const url = new URL(request.url);
    const contentId = url.searchParams.get('contentId');
    
    if (!contentId) {
      return NextResponse.json({ error: 'Missing contentId parameter' }, { status: 400 });
    }
    
    // Get SCORM tracking data
    const trackingData = await scormService.getScormTrackingData(userId, contentId);
    
    return NextResponse.json({ success: true, data: trackingData || null });
  } catch (error) {
    console.error('Error fetching SCORM tracking data:', error);
    return NextResponse.json({ error: 'Failed to fetch tracking data' }, { status: 500 });
  }
}
