-- Drop RLS policies for payment tables
DROP POLICY IF EXISTS admin_select_invoices ON payment.invoices;
DROP POLICY IF EXISTS admin_insert_invoices ON payment.invoices;
DROP POLICY IF EXISTS admin_update_invoices ON payment.invoices;
DROP POLICY IF EXISTS admin_delete_invoices ON payment.invoices;
DROP POLICY IF EXISTS user_select_invoices ON payment.invoices;

DROP POLICY IF EXISTS admin_select_payments ON payment.payments;
DROP POLICY IF EXISTS admin_insert_payments ON payment.payments;
DROP POLICY IF EXISTS admin_update_payments ON payment.payments;
DROP POLICY IF EXISTS admin_delete_payments ON payment.payments;
DROP POLICY IF EXISTS user_select_payments ON payment.payments;

DROP POLICY IF EXISTS admin_select_items ON payment.items;
DROP POLICY IF EXISTS admin_insert_items ON payment.items;
DROP POLICY IF EXISTS admin_update_items ON payment.items;
DROP POLICY IF EXISTS admin_delete_items ON payment.items;
DROP POLICY IF EXISTS user_select_items ON payment.items;

-- Drop payment tables
DROP TABLE IF EXISTS payment.items;
DROP TABLE IF EXISTS payment.payments;
DROP TABLE IF EXISTS payment.invoices;

-- Drop payment schema
DROP SCHEMA IF EXISTS payment;
