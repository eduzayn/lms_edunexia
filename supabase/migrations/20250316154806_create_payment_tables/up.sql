-- Create payment tables
CREATE SCHEMA IF NOT EXISTS payment;

-- Invoices table (created first to allow referencing from payments)
CREATE TABLE IF NOT EXISTS payment.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BRL',
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'cancelled', 'overdue')),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payment.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BRL',
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method TEXT NOT NULL,
  payment_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  infinitypay_payment_id TEXT,
  invoice_id UUID REFERENCES payment.invoices(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment items (courses, certificates, etc.)
CREATE TABLE IF NOT EXISTS payment.items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payment.payments(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('course', 'certificate', 'subscription', 'other')),
  item_id UUID,
  amount NUMERIC(10,2) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for payment tables
ALTER TABLE payment.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment.items ENABLE ROW LEVEL SECURITY;

-- Admin can see all invoices
CREATE POLICY admin_select_invoices ON payment.invoices
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Admin can insert/update/delete all invoices
CREATE POLICY admin_insert_invoices ON payment.invoices
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

CREATE POLICY admin_update_invoices ON payment.invoices
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

CREATE POLICY admin_delete_invoices ON payment.invoices
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Users can see their own invoices
CREATE POLICY user_select_invoices ON payment.invoices
  FOR SELECT USING (
    auth.uid() = user_id
  );

-- Admin can see all payments
CREATE POLICY admin_select_payments ON payment.payments
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Admin can insert/update/delete all payments
CREATE POLICY admin_insert_payments ON payment.payments
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

CREATE POLICY admin_update_payments ON payment.payments
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

CREATE POLICY admin_delete_payments ON payment.payments
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Users can see their own payments
CREATE POLICY user_select_payments ON payment.payments
  FOR SELECT USING (
    auth.uid() = user_id
  );

-- Admin can see all payment items
CREATE POLICY admin_select_items ON payment.items
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Admin can insert/update/delete all payment items
CREATE POLICY admin_insert_items ON payment.items
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

CREATE POLICY admin_update_items ON payment.items
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

CREATE POLICY admin_delete_items ON payment.items
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Users can see their own payment items
CREATE POLICY user_select_items ON payment.items
  FOR SELECT USING (
    payment_id IN (
      SELECT id FROM payment.payments WHERE user_id = auth.uid()
    )
  );
