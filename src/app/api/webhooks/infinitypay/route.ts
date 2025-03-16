import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../../../lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  
  // Verify webhook signature
  const signature = request.headers.get("x-infinitypay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }
  
  // TODO: Implement signature verification
  // const isValid = verifySignature(signature, await request.text(), process.env.INFINITYPAY_WEBHOOK_SECRET);
  // if (!isValid) {
  //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  // }
  
  const payload = await request.json();
  
  // Handle different event types
  switch (payload.event) {
    case "payment.completed":
      await handlePaymentCompleted(supabase, payload.data);
      break;
    case "payment.failed":
      await handlePaymentFailed(supabase, payload.data);
      break;
    case "payment.refunded":
      await handlePaymentRefunded(supabase, payload.data);
      break;
    default:
      console.log(`Unhandled event type: ${payload.event}`);
  }
  
  return NextResponse.json({ received: true });
}

async function handlePaymentCompleted(supabase: any, data: any) {
  // Get payment by InfinityPay ID
  const { data: payment } = await supabase
    .from("payment.payments")
    .select("*")
    .eq("infinitypay_payment_id", data.id)
    .single();
  
  if (!payment) {
    console.error(`Payment not found for InfinityPay ID: ${data.id}`);
    return;
  }
  
  // Update payment status
  await supabase
    .from("payment.payments")
    .update({
      status: "completed",
      payment_method: data.payment_method,
      payment_details: data.payment_details,
      updated_at: new Date().toISOString()
    })
    .eq("id", payment.id);
  
  // Update invoice status
  await supabase
    .from("payment.invoices")
    .update({
      status: "paid",
      paid_at: new Date().toISOString()
    })
    .eq("id", payment.invoice_id);
  
  // Process enrollment if payment is for a course
  const { data: items } = await supabase
    .from("payment.items")
    .select("*")
    .eq("payment_id", payment.id)
    .eq("item_type", "course");
  
  for (const item of items || []) {
    // Check if enrollment already exists
    const { data: existingEnrollment } = await supabase
      .from("enrollment.enrollments")
      .select("*")
      .eq("user_id", payment.user_id)
      .eq("course_id", item.item_id)
      .single();
    
    if (!existingEnrollment) {
      // Create enrollment
      await supabase
        .from("enrollment.enrollments")
        .insert({
          user_id: payment.user_id,
          course_id: item.item_id,
          status: "active"
        });
    } else {
      // Update enrollment if it exists but is not active
      if (existingEnrollment.status !== "active") {
        await supabase
          .from("enrollment.enrollments")
          .update({
            status: "active",
            updated_at: new Date().toISOString()
          })
          .eq("id", existingEnrollment.id);
      }
    }
  }
}

async function handlePaymentFailed(supabase: any, data: any) {
  // Get payment by InfinityPay ID
  const { data: payment } = await supabase
    .from("payment.payments")
    .select("*")
    .eq("infinitypay_payment_id", data.id)
    .single();
  
  if (!payment) {
    console.error(`Payment not found for InfinityPay ID: ${data.id}`);
    return;
  }
  
  // Update payment status
  await supabase
    .from("payment.payments")
    .update({
      status: "failed",
      payment_details: data.payment_details,
      updated_at: new Date().toISOString()
    })
    .eq("id", payment.id);
}

async function handlePaymentRefunded(supabase: any, data: any) {
  // Get payment by InfinityPay ID
  const { data: payment } = await supabase
    .from("payment.payments")
    .select("*")
    .eq("infinitypay_payment_id", data.id)
    .single();
  
  if (!payment) {
    console.error(`Payment not found for InfinityPay ID: ${data.id}`);
    return;
  }
  
  // Update payment status
  await supabase
    .from("payment.payments")
    .update({
      status: "refunded",
      payment_details: data.payment_details,
      updated_at: new Date().toISOString()
    })
    .eq("id", payment.id);
  
  // Update invoice status
  await supabase
    .from("payment.invoices")
    .update({
      status: "cancelled"
    })
    .eq("id", payment.invoice_id);
}
