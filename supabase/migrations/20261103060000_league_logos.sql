-- Apply after the previous Whistle migrations. Existing data and storage bucket are preserved.
begin;
alter table public.leagues add column if not exists logo_path text;
create or replace function public.admin_set_logo(p_entity text,p_id uuid,p_path text,p_side text default null) returns void language plpgsql set search_path=public as $$
declare expected text;
begin
 if p_entity in ('teams','leagues') then expected:=p_entity||'/'||p_id::text||'/';
 elsif p_entity='fixtures' and p_side in ('home','away') then expected:='fixtures/'||p_id::text||'/'||p_side||'/';
 else raise exception 'Choose a team, league or fixture side.'; end if;
 if p_path is not null then
  if p_path !~ ('^'||expected||'[0-9a-f-]{36}\.(png|jpg|webp)$')
    or not exists(select 1 from storage.objects where bucket_id='team-logos' and name=p_path) then raise exception 'Upload a valid logo first.'; end if;
 end if;
 if p_entity='leagues' then
  update leagues set logo_path=p_path where id=p_id and status='active';
 elsif p_entity='teams' then
  update teams set logo_path=p_path where id=p_id and status='active';
 else
  if p_side='home' then update fixtures set home_logo_path=p_path where id=p_id;
  else update fixtures set away_logo_path=p_path where id=p_id; end if;
 end if;
 if not found then raise exception 'Active team, league or match not found.'; end if;
end $$;
revoke execute on function public.admin_set_logo(text,uuid,text,text) from public,anon,authenticated;
grant execute on function public.admin_set_logo(text,uuid,text,text) to service_role;
notify pgrst, 'reload schema';
commit;
