-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE (Extends Supabase Auth)
-- Note: 'users' table usually duplicates auth.users for easier querying.
-- Using public.profiles approach is recommended.
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text unique not null,
  role text check (role in ('student', 'admin')) default 'student',
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SUBJECTS TABLE
create table public.subjects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SUBSCRIPTIONS TABLE
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  subject_id uuid references public.subjects(id) not null,
  month int not null,
  year int not null,
  is_active boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, subject_id, month, year)
);

-- VIDEOS TABLE
create table public.videos (
  id uuid default uuid_generate_v4() primary key,
  subject_id uuid references public.subjects(id) not null,
  title text not null,
  youtube_url text, -- If generic youtube link
  video_path text, -- If uploaded to Supabase Storage
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- QUIZZES TABLE
create table public.quizzes (
  id uuid default uuid_generate_v4() primary key,
  subject_id uuid references public.subjects(id) not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- QUESTIONS TABLE
create table public.questions (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references public.quizzes(id) not null,
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_answer text check (correct_answer in ('a', 'b', 'c', 'd')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RESULTS TABLE
create table public.results (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  quiz_id uuid references public.quizzes(id) not null,
  score int not null,
  total_questions int not null,
  total_points int not null,
  earned_points int not null,
  percentage decimal(5,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PACKAGES TABLE (for pricing tiers)
create table public.packages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  duration_months int not null,
  features text[], -- Array of features/benefits
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- USER PACKAGES TABLE (student package enrollment)
create table public.user_packages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  package_id uuid references public.packages(id) not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add points column to questions for weighted scoring
alter table public.questions add column if not exists points int default 1 not null;


-- ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.subscriptions enable row level security;
alter table public.videos enable row level security;
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.results enable row level security;
alter table public.packages enable row level security;
alter table public.user_packages enable row level security;

-- POLICIES (Simplified for initial setup)

-- Profiles: Users can read their own profile. Admins can read all.
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Subjects: Readable by everyone. Modifiable by admins only.
create policy "Subjects are viewable by everyone" on public.subjects for select using (true);

-- Subscriptions: Users see own. Admins see all.
create policy "Users can see own subscriptions" on public.subscriptions for select using (auth.uid() = user_id);

-- Videos: Admins can do everything. Students need active subscription (Checked in logic or complex RLS). 
-- For simplicity, we limit by application logic mostly, but RLS is cleaner.
-- We will start with basic read access for authenticated users, and refine later.
create policy "Videos viewable by authenticated users" on public.videos for select using (auth.role() = 'authenticated');

-- Quizzes/Questions: Read by auth users.
create policy "Quizzes viewable by authenticated users" on public.quizzes for select using (auth.role() = 'authenticated');
create policy "Questions viewable by authenticated users" on public.questions for select using (auth.role() = 'authenticated');

-- Results: Users see own.
create policy "Users can see own results" on public.results for select using (auth.uid() = user_id);
create policy "Users can insert own results" on public.results for insert with check (auth.uid() = user_id);

-- Packages: Viewable by everyone (public pricing page)
create policy "Packages are viewable by everyone" on public.packages for select using (true);

-- User Packages: Users see own. Admins see all.
create policy "Users can see own packages" on public.user_packages for select using (auth.uid() = user_id);


-- ADMIN POLICIES: Admins can do everything on all tables
-- Helper function to check if user is admin
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = user_id and role = 'admin'
  );
$$ language sql security definer;

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Admin policies for subjects
create policy "Admins can insert subjects" on public.subjects for insert 
  with check (public.is_admin(auth.uid()));
create policy "Admins can update subjects" on public.subjects for update 
  using (public.is_admin(auth.uid()));
create policy "Admins can delete subjects" on public.subjects for delete 
  using (public.is_admin(auth.uid()));

-- Admin policies for videos
create policy "Admins can insert videos" on public.videos for insert 
  with check (public.is_admin(auth.uid()));
create policy "Admins can update videos" on public.videos for update 
  using (public.is_admin(auth.uid()));
create policy "Admins can delete videos" on public.videos for delete 
  using (public.is_admin(auth.uid()));

-- Admin policies for quizzes
create policy "Admins can insert quizzes" on public.quizzes for insert 
  with check (public.is_admin(auth.uid()));
create policy "Admins can update quizzes" on public.quizzes for update 
  using (public.is_admin(auth.uid()));
create policy "Admins can delete quizzes" on public.quizzes for delete 
  using (public.is_admin(auth.uid()));

-- Admin policies for questions
create policy "Admins can insert questions" on public.questions for insert 
  with check (public.is_admin(auth.uid()));
create policy "Admins can update questions" on public.questions for update 
  using (public.is_admin(auth.uid()));
create policy "Admins can delete questions" on public.questions for delete 
  using (public.is_admin(auth.uid()));

-- Admin policies for subscriptions
create policy "Admins can view all subscriptions" on public.subscriptions for select 
  using (public.is_admin(auth.uid()));
create policy "Admins can insert subscriptions" on public.subscriptions for insert 
  with check (public.is_admin(auth.uid()));
create policy "Admins can update subscriptions" on public.subscriptions for update 
  using (public.is_admin(auth.uid()));
create policy "Admins can delete subscriptions" on public.subscriptions for delete 
  using (public.is_admin(auth.uid()));

-- Admin policies for results
create policy "Admins can view all results" on public.results for select 
  using (public.is_admin(auth.uid()));

-- Admin policies for packages
create policy "Admins can insert packages" on public.packages for insert 
  with check (public.is_admin(auth.uid()));
create policy "Admins can update packages" on public.packages for update 
  using (public.is_admin(auth.uid()));
create policy "Admins can delete packages" on public.packages for delete 
  using (public.is_admin(auth.uid()));

-- Admin policies for user_packages
create policy "Admins can view all user packages" on public.user_packages for select 
  using (public.is_admin(auth.uid()));
create policy "Admins can insert user packages" on public.user_packages for insert 
  with check (public.is_admin(auth.uid()));
create policy "Admins can update user packages" on public.user_packages for update 
  using (public.is_admin(auth.uid()));
create policy "Admins can delete user packages" on public.user_packages for delete 
  using (public.is_admin(auth.uid()));

-- STORAGE (If creating 'videos' bucket)
-- insert into storage.buckets (id, name) values ('videos', 'videos');
-- create policy "Videos are publicly accessible" on storage.objects for select using ( bucket_id = 'videos' );
-- create policy "Admins can upload videos" on storage.objects for insert using ( bucket_id = 'videos' ); -- Needs admin check util function

-- SEED DATA: Create the three package plans
INSERT INTO public.packages (name, description, price, duration_months, features, is_active)
VALUES 
  -- 3-Day Trial Package
  (
    '3-Day Trial',
    'Try our platform with full access for 3 days',
    0.00,
    0,  -- Special: 0 months means 3 days (handle in application logic)
    ARRAY[
      'Access to all subjects',
      'HD video lessons',
      'Interactive quizzes',
      '3-day full access'
    ],
    true
  ),
  
  -- 1-Month Package
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
  
  -- 3-Month Package
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
ON CONFLICT DO NOTHING;  -- Prevent duplicate inserts if run multiple times
