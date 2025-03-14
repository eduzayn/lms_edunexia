import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.videoId || !body.rating) {
      return NextResponse.json(
        { error: "Video ID and rating are required" },
        { status: 400 }
      );
    }
    
    // Get user ID from session
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Save feedback to database
    const { error } = await supabase
      .from('content.video_feedback')
      .insert({
        video_id: body.videoId,
        user_id: user.id,
        rating: body.rating,
        comment: body.comment || null,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error saving video feedback:', error);
      return NextResponse.json(
        { error: "Failed to save feedback" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in video feedback API:", error);
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}
