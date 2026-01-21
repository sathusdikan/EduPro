-- Copy and paste this into Supabase SQL Editor to create the 3 packages

INSERT INTO public.packages (name, description, price, duration_months, features, is_active)
VALUES 
  -- 3-Day Trial Package (FREE)
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
  
  -- 1-Month Package (₹999)
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
  
  -- 3-Month Package (₹2499)
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
  );
