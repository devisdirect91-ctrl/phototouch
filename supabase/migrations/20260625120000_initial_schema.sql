-- PhotoTouch — schéma initial
-- Tables: profiles, generations, moderation_logs
-- RLS activé partout · buckets storage privés · triggers updated_at + auto-création du profil.
--
-- Modèle de sécurité (résumé) :
--   • profiles        : l'utilisateur LIT son profil ; toutes les ÉCRITURES passent côté
--                       serveur (service_role) — un user ne peut PAS modifier son
--                       subscription_status lui-même.
--   • generations     : l'utilisateur gère uniquement ses propres lignes.
--   • moderation_logs : aucune policy → inaccessible aux clients ; lecture admin via service_role.

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────
--  profiles
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id                      uuid primary key references auth.users (id) on delete cascade,
  email                   text,
  birth_date              date,
  parental_consent        boolean      not null default false,
  parent_email            text,
  stripe_customer_id      text unique,
  subscription_status     text         not null default 'free'
    check (subscription_status in ('free','trialing','active','past_due','canceled','lifetime')),
  subscription_id         text,
  trial_ends_at           timestamptz,
  current_period_end      timestamptz,
  generations_used_trial  integer      not null default 0,
  is_admin                boolean      not null default false,
  created_at              timestamptz  not null default now(),
  updated_at              timestamptz  not null default now()
);

-- ─────────────────────────────────────────────
--  generations
-- ─────────────────────────────────────────────
create table if not exists public.generations (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references public.profiles (id) on delete cascade,
  source_image_url     text,
  reference_image_url  text,
  prompt               text,
  result_image_url     text,
  status               text not null default 'pending'
    check (status in ('pending','processing','completed','failed','blocked')),
  moderation_passed    boolean,
  model_used           text,
  created_at           timestamptz not null default now()
);

create index if not exists generations_user_created_idx
  on public.generations (user_id, created_at desc);

-- ─────────────────────────────────────────────
--  moderation_logs (traçabilité)
-- ─────────────────────────────────────────────
create table if not exists public.moderation_logs (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references public.profiles (id) on delete cascade,
  generation_id  uuid references public.generations (id) on delete set null,
  type           text not null check (type in ('prompt','source_image','result_image')),
  passed         boolean not null,
  reason         text,
  created_at     timestamptz not null default now()
);

create index if not exists moderation_logs_user_created_idx
  on public.moderation_logs (user_id, created_at desc);

-- ─────────────────────────────────────────────
--  Triggers
-- ─────────────────────────────────────────────

-- updated_at automatique sur profiles
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Création automatique du profil à l'inscription
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────
--  RLS
-- ─────────────────────────────────────────────
alter table public.profiles        enable row level security;
alter table public.generations     enable row level security;
alter table public.moderation_logs enable row level security;

-- profiles : lecture de son propre profil uniquement (écritures = serveur/service_role)
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using (auth.uid() = id);

-- generations : l'utilisateur gère ses propres lignes
drop policy if exists "generations_select_own" on public.generations;
create policy "generations_select_own" on public.generations
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "generations_insert_own" on public.generations;
create policy "generations_insert_own" on public.generations
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "generations_update_own" on public.generations;
create policy "generations_update_own" on public.generations
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "generations_delete_own" on public.generations;
create policy "generations_delete_own" on public.generations
  for delete to authenticated
  using (auth.uid() = user_id);

-- moderation_logs : aucune policy → seul le service_role (admin) y accède.

-- ─────────────────────────────────────────────
--  Storage : buckets privés + policies propriétaire
--  Convention de chemin : "<user_id>/<fichier>" (1er dossier = id du propriétaire)
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values
  ('user-uploads', 'user-uploads', false),
  ('references',   'references',   false),
  ('results',      'results',      false)
on conflict (id) do nothing;

drop policy if exists "user_uploads_owner" on storage.objects;
create policy "user_uploads_owner" on storage.objects
  for all to authenticated
  using      (bucket_id = 'user-uploads' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'user-uploads' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "references_owner" on storage.objects;
create policy "references_owner" on storage.objects
  for all to authenticated
  using      (bucket_id = 'references' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'references' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "results_owner" on storage.objects;
create policy "results_owner" on storage.objects
  for all to authenticated
  using      (bucket_id = 'results' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'results' and (storage.foldername(name))[1] = auth.uid()::text);
