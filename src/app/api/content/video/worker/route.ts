import { NextRequest, NextResponse } from "next/server";
import { videoGeneratorService } from "../../../../../lib/services/video-generator-service";

export async function POST(request: NextRequest) {
  try {
    // This endpoint should be called by a cron job or similar
    // to process the next video generation job in the queue
    
    // Check for authorization (in a real implementation, this would use a secure token)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    if (token !== process.env.VIDEO_WORKER_SECRET) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
    
    // Process the next job in the queue
    const result = await videoGeneratorService.processNextJob();
    
    return NextResponse.json({ success: result.success, videoId: result.videoId });
  } catch (error) {
    console.error("Error in video worker API:", error);
    return NextResponse.json(
      { error: "Failed to process video job" },
      { status: 500 }
    );
  }
}
