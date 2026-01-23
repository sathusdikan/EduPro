-- Allow admins to delete results to enable subject cascade removals
create policy if not exists "Admins can delete results" on public.results for delete
  using (public.is_admin(auth.uid()));

