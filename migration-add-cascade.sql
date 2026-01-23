-- Enable cascading deletes so removing a subject automatically removes dependent rows
-- Note: Adjust constraint names if your project uses custom names

-- Quizzes -> Subjects
alter table public.quizzes
  drop constraint if exists quizzes_subject_id_fkey,
  add constraint quizzes_subject_id_fkey
    foreign key (subject_id) references public.subjects(id) on delete cascade;

-- Videos -> Subjects
alter table public.videos
  drop constraint if exists videos_subject_id_fkey,
  add constraint videos_subject_id_fkey
    foreign key (subject_id) references public.subjects(id) on delete cascade;

-- Subscriptions -> Subjects
alter table public.subscriptions
  drop constraint if exists subscriptions_subject_id_fkey,
  add constraint subscriptions_subject_id_fkey
    foreign key (subject_id) references public.subjects(id) on delete cascade;

-- Questions -> Quizzes
alter table public.questions
  drop constraint if exists questions_quiz_id_fkey,
  add constraint questions_quiz_id_fkey
    foreign key (quiz_id) references public.quizzes(id) on delete cascade;

-- Results -> Quizzes
alter table public.results
  drop constraint if exists results_quiz_id_fkey,
  add constraint results_quiz_id_fkey
    foreign key (quiz_id) references public.quizzes(id) on delete cascade;

