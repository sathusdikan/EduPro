-- Migration: Add Package System Tables
-- Run this in Supabase SQL Editor

-- 1. Create packages table
CREATE TABLE IF NOT EXISTS public.packages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  duration_months int not null,
  features text[],
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create user_packages table
CREATE TABLE IF NOT EXISTS public.user_packages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  package_id uuid references public.packages(id) not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Add points column to questions (if not exists)
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS points int default 1 not null;

-- 4. Add new columns to results table (if not exists)
ALTER TABLE public.results ADD COLUMN IF NOT EXISTS total_points int;
ALTER TABLE public.results ADD COLUMN IF NOT EXISTS earned_points int;
ALTER TABLE public.results ADD COLUMN IF NOT EXISTS percentage decimal(5,2);

-- 5. Enable RLS on new tables
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_packages ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for packages
DROP POLICY IF EXISTS "Packages are viewable by everyone" ON public.packages;
CREATE POLICY "Packages are viewable by everyone" ON public.packages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert packages" ON public.packages;
CREATE POLICY "Admins can insert packages" ON public.packages FOR INSERT 
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update packages" ON public.packages;
CREATE POLICY "Admins can update packages" ON public.packages FOR UPDATE 
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete packages" ON public.packages;
CREATE POLICY "Admins can delete packages" ON public.packages FOR DELETE 
  USING (public.is_admin(auth.uid()));

-- 7. Create RLS policies for user_packages
DROP POLICY IF EXISTS "Users can see own packages" ON public.user_packages;
CREATE POLICY "Users can see own packages" ON public.user_packages FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all user packages" ON public.user_packages;
CREATE POLICY "Admins can view all user packages" ON public.user_packages FOR SELECT 
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert user packages" ON public.user_packages;
CREATE POLICY "Admins can insert user packages" ON public.user_packages FOR INSERT 
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update user packages" ON public.user_packages;
CREATE POLICY "Admins can update user packages" ON public.user_packages FOR UPDATE 
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete user packages" ON public.user_packages;
CREATE POLICY "Admins can delete user packages" ON public.user_packages FOR DELETE 
  USING (public.is_admin(auth.uid()));

-- 8. Insert the 3 packages
INSERT INTO public.packages (name, description, price, duration_months, features, is_active)
VALUES 
  (
    '3-Day Trial',
    'Try our platform with full access for 3 days',
    0.00,
    0,
    ARRAY[
      'Access to all subjects',
      'HD video lessons',
      'Interactive quizzes',
      '3-day full access'
    ],
    true
  ),
  (
    '1-Month Package',
    'One month of unlimited learning access',
    999.00,
    1,
    ARRAY[
      'Access to all subjects',
      'HD video lessons', 
      'Interactive quizzes',
      'Progress tracking',
      '30 days access'
    ],
    true
  ),
  (
    '3-Month Package',
    'Three months of comprehensive learning',
    2499.00,
    3,
    ARRAY[
      'Access to all subjects',
      'HD video lessons',
      'Interactive quizzes',
      'Progress tracking',
      'Priority support',
      '90 days access'
    ],
    true
  )
ON CONFLICT DO NOTHING;

-- Done! Check /admin/packages to see your packages.
