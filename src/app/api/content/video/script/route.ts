import { NextRequest, NextResponse } from "next/server";
import { videoGeneratorService } from "../../../../../lib/services/video-generator-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }
    
    const result = await videoGeneratorService.generateVideoScript({
      title: body.title,
      description: body.description,
      style: body.style,
      duration: body.duration
    });
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    return NextResponse.json({ script: result.script });
  } catch (error) {
    console.error("Error in script generation API:", error);
    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    );
  }
}
