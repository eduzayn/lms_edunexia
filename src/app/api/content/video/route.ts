import { NextRequest, NextResponse } from "next/server";
import { videoGeneratorService } from "../../../../lib/services/video-generator-service";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: "Title and description are required" },
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
    
    const result = await videoGeneratorService.generateVideo({
      title: body.title,
      description: body.description,
      script: body.script,
      duration: body.duration,
      style: body.style,
      voiceType: body.voiceType,
      includeSubtitles: body.includeSubtitles,
      courseId: body.courseId,
      lessonId: body.lessonId
    }, user.id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ videoId: result.videoId }, { status: 201 });
  } catch (error) {
    console.error("Error in video generation API:", error);
    return NextResponse.json(
      { error: "Failed to generate video" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get("id");
  const courseId = searchParams.get("courseId");
  const createdBy = searchParams.get("createdBy");
  
  try {
    if (videoId) {
      // Get a specific video
      const result = await videoGeneratorService.getVideo(videoId);
      
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 404 });
      }
      
      return NextResponse.json(result.data);
    } else {
      // List videos with optional filters
      const result = await videoGeneratorService.listVideos(
        courseId || undefined,
        createdBy || undefined
      );
      
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      
      return NextResponse.json(result.data);
    }
  } catch (error) {
    console.error("Error in video API:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get("id");
  
  if (!videoId) {
    return NextResponse.json(
      { error: "Video ID is required" },
      { status: 400 }
    );
  }
  
  try {
    const result = await videoGeneratorService.deleteVideo(videoId);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in video API:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
