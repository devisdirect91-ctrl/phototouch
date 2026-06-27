-- Compteur de visites (1 ligne par page vue), service_role only.
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text,
  created_at timestamptz not null default now()
);
create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
alter table public.page_views enable row level security;
-- aucune policy : insertion via service_role (route /api/track) uniquement
