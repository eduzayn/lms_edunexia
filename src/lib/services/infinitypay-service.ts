import { createServerSupabaseClient } from "../../lib/supabase/server";

export const infinityPayService = {
  async createPayment(userId: string, amount: number, items: any[], description: string) {
    const supabase = createServerSupabaseClient();
    
    // Get user details
    const { data: user } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("payment.invoices")
      .insert({
        user_id: userId,
        amount: amount,
        status: "sent",
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        items: items
      })
      .select()
      .single();
    
    if (invoiceError) {
      throw new Error(`Failed to create invoice: ${invoiceError.message}`);
    }
    
    // Call InfinityPay API to create payment
    const response = await fetch(process.env.INFINITYPAY_API_URL + "/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.INFINITYPAY_API_KEY}`
      },
      body: JSON.stringify({
        amount: amount,
        currency: "BRL",
        description: description,
        customer: {
          id: userId,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email
        },
        invoice_id: invoice.id,
        metadata: {
          items: items
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create payment in InfinityPay: ${response.statusText}`);
    }
    
    const paymentData = await response.json();
    
    // Create payment record in database
    const { data: payment, error: paymentError } = await supabase
      .from("payment.payments")
      .insert({
        user_id: userId,
        amount: amount,
        status: "pending",
        payment_method: "credit_card", // Default, will be updated by webhook
        payment_details: {},
        infinitypay_payment_id: paymentData.id,
        invoice_id: invoice.id
      })
      .select()
      .single();
    
    if (paymentError) {
      throw new Error(`Failed to create payment record: ${paymentError.message}`);
    }
    
    // Create payment items
    for (const item of items) {
      const { error: itemError } = await supabase
        .from("payment.items")
        .insert({
          payment_id: payment.id,
          item_type: item.type,
          item_id: item.id,
          amount: item.amount,
          description: item.description
        });
      
      if (itemError) {
        console.error(`Failed to create payment item: ${itemError.message}`);
      }
    }
    
    return {
      payment,
      checkout_url: paymentData.checkout_url
    };
  },
  
  async getPaymentStatus(paymentId: string) {
    const supabase = createServerSupabaseClient();
    
    // Get payment details
    const { data: payment } = await supabase
      .from("payment.payments")
      .select("*")
      .eq("id", paymentId)
      .single();
    
    if (!payment) {
      throw new Error("Payment not found");
    }
    
    // Call InfinityPay API to get payment status
    const response = await fetch(process.env.INFINITYPAY_API_URL + `/payments/${payment.infinitypay_payment_id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.INFINITYPAY_API_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get payment status from InfinityPay: ${response.statusText}`);
    }
    
    const paymentData = await response.json();
    
    // Update payment record in database
    const { data: updatedPayment, error } = await supabase
      .from("payment.payments")
      .update({
        status: paymentData.status,
        payment_method: paymentData.payment_method,
        payment_details: paymentData.payment_details,
        updated_at: new Date().toISOString()
      })
      .eq("id", paymentId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update payment record: ${error.message}`);
    }
    
    // If payment is completed, update invoice
    if (paymentData.status === "completed") {
      await supabase
        .from("payment.invoices")
        .update({
          status: "paid",
          paid_at: new Date().toISOString()
        })
        .eq("id", payment.invoice_id);
    }
    
    return updatedPayment;
  },
  
  async refundPayment(paymentId: string, amount?: number) {
    const supabase = createServerSupabaseClient();
    
    // Get payment details
    const { data: payment } = await supabase
      .from("payment.payments")
      .select("*")
      .eq("id", paymentId)
      .single();
    
    if (!payment) {
      throw new Error("Payment not found");
    }
    
    // Call InfinityPay API to refund payment
    const response = await fetch(process.env.INFINITYPAY_API_URL + `/payments/${payment.infinitypay_payment_id}/refund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.INFINITYPAY_API_KEY}`
      },
      body: JSON.stringify({
        amount: amount || payment.amount // Full refund if amount not specified
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to refund payment in InfinityPay: ${response.statusText}`);
    }
    
    const refundData = await response.json();
    
    // Update payment record in database
    const { data: updatedPayment, error } = await supabase
      .from("payment.payments")
      .update({
        status: "refunded",
        payment_details: {
          ...payment.payment_details,
          refund: refundData
        },
        updated_at: new Date().toISOString()
      })
      .eq("id", paymentId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update payment record: ${error.message}`);
    }
    
    // Update invoice status
    await supabase
      .from("payment.invoices")
      .update({
        status: "cancelled"
      })
      .eq("id", payment.invoice_id);
    
    return updatedPayment;
  },
  
  async getAllPayments(userId: string) {
    const supabase = createServerSupabaseClient();
    
    // Get all payments for user
    const { data: payments, error } = await supabase
      .from("payment.payments")
      .select(`
        *,
        invoice:invoice_id (
          id,
          status,
          due_date,
          paid_at
        ),
        items:payment.items (
          id,
          item_type,
          item_id,
          amount,
          description
        )
      `)
      .eq("user_id", userId);
    
    if (error) {
      throw new Error(`Failed to get payments: ${error.message}`);
    }
    
    return payments;
  },
  
  async syncPaymentsWithInfinityPay() {
    const supabase = createServerSupabaseClient();
    
    // Get all pending or processing payments
    const { data: payments, error } = await supabase
      .from("payment.payments")
      .select("*")
      .in("status", ["pending", "processing"]);
    
    if (error) {
      throw new Error(`Failed to get payments: ${error.message}`);
    }
    
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };
    
    // Update each payment status from InfinityPay
    for (const payment of payments || []) {
      try {
        if (!payment.infinitypay_payment_id) continue;
        
        await this.getPaymentStatus(payment.id);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Payment ${payment.id}: ${(error as Error).message}`);
      }
    }
    
    return results;
  }
};
