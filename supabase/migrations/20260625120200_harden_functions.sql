-- PhotoTouch — hardening (suite aux advisors de sécurité Supabase)

-- 1) search_path fixe sur le trigger updated_at (évite l'injection via search_path)
alter function public.set_updated_at() set search_path = '';

-- 2) retire l'exposition RPC des fonctions internes (appelées par trigger/cron uniquement).
--    Les triggers et cron.schedule (owner = postgres) continuent de fonctionner.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.delete_expired_source_images() from public, anon, authenticated;
