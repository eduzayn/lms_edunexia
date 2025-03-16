import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../../../lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  
  // Verify webhook signature
  const signature = request.headers.get("x-lytex-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }
  
  // TODO: Implement signature verification
  // const isValid = verifySignature(signature, await request.text(), process.env.LYTEX_WEBHOOK_SECRET);
  // if (!isValid) {
  //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  // }
  
  const payload = await request.json();
  
  // Handle different event types
  switch (payload.event) {
    case "enrollment.updated":
      await handleEnrollmentUpdated(supabase, payload.data);
      break;
    case "enrollment.completed":
      await handleEnrollmentCompleted(supabase, payload.data);
      break;
    case "enrollment.cancelled":
      await handleEnrollmentCancelled(supabase, payload.data);
      break;
    default:
      console.log(`Unhandled event type: ${payload.event}`);
  }
  
  return NextResponse.json({ received: true });
}

async function handleEnrollmentUpdated(supabase: any, data: any) {
  // Get enrollment by Lytex ID
  const { data: enrollment } = await supabase
    .from("enrollment.enrollments")
    .select("*")
    .eq("lytex_enrollment_id", data.id)
    .single();
  
  if (!enrollment) {
    console.error(`Enrollment not found for Lytex ID: ${data.id}`);
    return;
  }
  
  // Update enrollment status and progress
  await supabase
    .from("enrollment.enrollments")
    .update({
      status: data.status,
      progress: data.progress,
      updated_at: new Date().toISOString()
    })
    .eq("id", enrollment.id);
  
  // Update student progress in analytics
  await supabase
    .from("analytics.student_progress")
    .upsert({
      student_id: enrollment.user_id,
      course_id: enrollment.course_id,
      progress_percentage: data.progress,
      last_activity_at: new Date().toISOString()
    }, {
      onConflict: "student_id,course_id"
    });
}

async function handleEnrollmentCompleted(supabase: any, data: any) {
  // Get enrollment by Lytex ID
  const { data: enrollment } = await supabase
    .from("enrollment.enrollments")
    .select("*")
    .eq("lytex_enrollment_id", data.id)
    .single();
  
  if (!enrollment) {
    console.error(`Enrollment not found for Lytex ID: ${data.id}`);
    return;
  }
  
  // Update enrollment status and completion date
  await supabase
    .from("enrollment.enrollments")
    .update({
      status: "completed",
      progress: 100,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("id", enrollment.id);
  
  // Update student progress in analytics
  await supabase
    .from("analytics.student_progress")
    .upsert({
      student_id: enrollment.user_id,
      course_id: enrollment.course_id,
      progress_percentage: 100,
      last_activity_at: new Date().toISOString()
    }, {
      onConflict: "student_id,course_id"
    });
  
  // Check if certificate should be generated
  const { data: course } = await supabase
    .from("courses")
    .select("auto_certificate")
    .eq("id", enrollment.course_id)
    .single();
  
  if (course?.auto_certificate) {
    // Generate certificate
    await supabase
      .from("certificates.certificates")
      .insert({
        user_id: enrollment.user_id,
        course_id: enrollment.course_id,
        issue_date: new Date().toISOString(),
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
      });
  }
}

async function handleEnrollmentCancelled(supabase: any, data: any) {
  // Get enrollment by Lytex ID
  const { data: enrollment } = await supabase
    .from("enrollment.enrollments")
    .select("*")
    .eq("lytex_enrollment_id", data.id)
    .single();
  
  if (!enrollment) {
    console.error(`Enrollment not found for Lytex ID: ${data.id}`);
    return;
  }
  
  // Update enrollment status
  await supabase
    .from("enrollment.enrollments")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString()
    })
    .eq("id", enrollment.id);
}
