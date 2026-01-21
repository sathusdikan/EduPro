-- Migration: Add Payments Table for Transaction History
-- This table tracks all payment transactions (both successful and failed)

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  package_id uuid REFERENCES public.packages(id) NOT NULL,
  user_package_id uuid REFERENCES public.user_packages(id),
  amount decimal(10,2) NOT NULL,
  status text CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  payment_method text DEFAULT 'mock_card',
  transaction_id text UNIQUE NOT NULL,
  error_message text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments
CREATE POLICY "Users can view own payments" ON public.payments 
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all payments
CREATE POLICY "Admins can view all payments" ON public.payments 
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON public.payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- Add comment
COMMENT ON TABLE public.payments IS 'Stores all payment transaction records including mock payments';
