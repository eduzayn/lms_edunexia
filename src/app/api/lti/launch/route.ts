import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../lib/supabase/server';
import { ltiService } from '../../../../lib/services/lti-service';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const body = await request.json();
    
    const { contentId, ltiToolId } = body;
    
    if (!contentId || !ltiToolId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create LTI session
    const ltiSession = await ltiService.createLtiSession(userId, contentId, ltiToolId);
    
    if (!ltiSession) {
      return NextResponse.json({ error: 'Failed to create LTI session' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data: ltiSession });
  } catch (error) {
    console.error('Error creating LTI session:', error);
    return NextResponse.json({ error: 'Failed to create LTI session' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sessionToken = url.searchParams.get('token');
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Missing token parameter' }, { status: 400 });
    }
    
    // Get LTI session
    const ltiSession = await ltiService.getLtiSession(sessionToken);
    
    if (!ltiSession) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    
    return NextResponse.json({ success: true, data: ltiSession });
  } catch (error) {
    console.error('Error fetching LTI session:', error);
    return NextResponse.json({ error: 'Failed to fetch LTI session' }, { status: 500 });
  }
}
