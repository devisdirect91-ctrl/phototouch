-- PhotoTouch — rétention des données (RGPD)
-- Supprime les images sources après 30 jours et efface la référence côté generations.
--
-- ⚠️ Nécessite l'extension pg_cron (disponible sur Supabase). Si elle n'est pas
-- autorisée sur ton projet, ignore cette migration et planifie plutôt
-- public.delete_expired_source_images() via une Edge Function programmée ou un cron externe.

create extension if not exists pg_cron;

create or replace function public.delete_expired_source_images()
returns void
language plpgsql
security definer
set search_path = public, storage
as $$
begin
  -- supprime les fichiers sources de plus de 30 jours
  delete from storage.objects
  where bucket_id = 'user-uploads'
    and created_at < now() - interval '30 days';

  -- efface la référence côté generations
  update public.generations
     set source_image_url = null
   where source_image_url is not null
     and created_at < now() - interval '30 days';
end;
$$;

-- Planification quotidienne à 03:00 UTC.
-- (Re-jouer cette migration nécessite d'abord cron.unschedule('delete-expired-source-images').)
select cron.schedule(
  'delete-expired-source-images',
  '0 3 * * *',
  $$ select public.delete_expired_source_images(); $$
);
