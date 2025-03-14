import { NextRequest, NextResponse } from "next/server";
import { studentFeedbackService } from "../../../../lib/services/student-feedback-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.studentId || !body.activityId || !body.submissionId || !body.content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const result = await studentFeedbackService.generateFeedback({
      studentId: body.studentId,
      activityId: body.activityId,
      submissionId: body.submissionId,
      content: body.content,
      courseId: body.courseId,
      lessonId: body.lessonId
    });
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error in feedback API:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const submissionId = searchParams.get("submissionId");
  const studentId = searchParams.get("studentId");
  
  try {
    if (submissionId) {
      // Get feedback for a specific submission
      const result = await studentFeedbackService.getFeedback(submissionId);
      
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 404 });
      }
      
      return NextResponse.json(result.data);
    } else if (studentId) {
      // List feedback for a student
      const result = await studentFeedbackService.listFeedbackByStudent(studentId);
      
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      
      return NextResponse.json(result.data);
    } else {
      return NextResponse.json(
        { error: "Either submissionId or studentId is required" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in feedback API:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
