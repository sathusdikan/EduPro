-- Migration: Add Admin Wallet and Transaction Tracking
-- This tracks admin earnings from student payments

-- Create admin_wallet table to track admin account balance
CREATE TABLE IF NOT EXISTS public.admin_wallet (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id uuid REFERENCES public.profiles(id) NOT NULL,
  balance decimal(10,2) DEFAULT 0.00 NOT NULL,
  total_earnings decimal(10,2) DEFAULT 0.00 NOT NULL,
  account_number text,
  bank_name text,
  ifsc_code text,
  upi_id text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(admin_id)
);

-- Create wallet_transactions table to track all money movements
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id uuid REFERENCES public.profiles(id) NOT NULL,
  payment_id uuid REFERENCES public.payments(id),
  transaction_type text CHECK (transaction_type IN ('credit', 'debit', 'withdrawal')) NOT NULL,
  amount decimal(10,2) NOT NULL,
  balance_before decimal(10,2) NOT NULL,
  balance_after decimal(10,2) NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.admin_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Admins can view their own wallet
CREATE POLICY "Admins can view own wallet" ON public.admin_wallet 
  FOR SELECT USING (auth.uid() = admin_id AND public.is_admin(auth.uid()));

-- Admins can update their own wallet
CREATE POLICY "Admins can update own wallet" ON public.admin_wallet 
  FOR UPDATE USING (auth.uid() = admin_id AND public.is_admin(auth.uid()));

-- Admins can view their own transactions
CREATE POLICY "Admins can view own transactions" ON public.wallet_transactions 
  FOR SELECT USING (auth.uid() = admin_id AND public.is_admin(auth.uid()));

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_wallet_admin_id ON public.admin_wallet(admin_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_admin_id ON public.wallet_transactions(admin_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_payment_id ON public.wallet_transactions(payment_id);

-- Add comment
COMMENT ON TABLE public.admin_wallet IS 'Stores admin account balance and earnings from student payments';
COMMENT ON TABLE public.wallet_transactions IS 'Tracks all wallet transactions including credits from payments';

-- Add reference_id column to payments table to link with wallet transactions
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS wallet_transaction_id uuid REFERENCES public.wallet_transactions(id);

-- Create or replace function to get the main admin (first admin in the system)
CREATE OR REPLACE FUNCTION public.get_main_admin_id()
RETURNS uuid AS $$
  SELECT id FROM public.profiles
  WHERE role = 'admin'
  ORDER BY created_at ASC
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Initialize wallet for existing admin
INSERT INTO public.admin_wallet (admin_id, balance, total_earnings)
SELECT id, 0.00, 0.00
FROM public.profiles
WHERE role = 'admin'
ON CONFLICT (admin_id) DO NOTHING;
