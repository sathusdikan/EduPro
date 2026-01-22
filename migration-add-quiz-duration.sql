-- Add optional duration column to quizzes for timed assessments
alter table public.quizzes add column if not exists duration_minutes int;

