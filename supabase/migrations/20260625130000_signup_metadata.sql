-- handle_new_user : copie aussi date de naissance / consentement parental
-- depuis les métadonnées d'inscription (raw_user_meta_data), pour éviter une
-- écriture service_role côté serveur au moment de l'inscription.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, birth_date, parental_consent, parent_email)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data->>'birth_date', '')::date,
    coalesce((new.raw_user_meta_data->>'parental_consent')::boolean, false),
    nullif(new.raw_user_meta_data->>'parent_email', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- conserve le durcissement (pas d'exposition RPC)
revoke all on function public.handle_new_user() from public, anon, authenticated;
