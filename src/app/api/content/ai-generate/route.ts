import { NextRequest, NextResponse } from "next/server";
import { contentEditorService } from "../../../../lib/services/content-editor-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.prompt || !body.type) {
      return NextResponse.json(
        { error: "Prompt and type are required" },
        { status: 400 }
      );
    }
    
    const result = await contentEditorService.generateAIContent(
      body.prompt,
      body.type
    );
    
    // Since AIContentSuggestion doesn't have success/error properties in some contexts
    return NextResponse.json({ 
      content: result.content,
      title: result.title,
      type: result.type
    });
  } catch (error) {
    console.error("Error in AI generate API:", error);
    return NextResponse.json(
      { error: "Failed to generate AI content" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
