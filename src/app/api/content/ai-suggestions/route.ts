import { NextRequest, NextResponse } from "next/server";
import { contentEditorService } from "../../../../lib/services/content-editor-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }
    
    const result = await contentEditorService.getAIContentSuggestions(body.content);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    return NextResponse.json(result.suggestions);
  } catch (error) {
    console.error("Error in AI suggestions API:", error);
    return NextResponse.json(
      { error: "Failed to generate AI suggestions" },
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
