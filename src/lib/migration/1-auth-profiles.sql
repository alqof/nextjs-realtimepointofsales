-- create table profiles
create table public.profiles(
  id uuid NOT NULL references auth.users ON DELETE CASCADE,
  name text,
  role text,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  primary key (id)
);
alter table public.profiles enable row level security;



-- ############################################################
-- insert a row into public.profiles when user is created
-- ############################################################
create function public.handle_create_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, image_url)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'name',
    NEW.raw_user_meta_data ->> 'role',
    NEW.raw_user_meta_data ->> 'image_url'
  );
  RETURN NEW;
end; $$ 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = '';


-- [trigger]
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_create_user();



-- ############################################################
-- delete a row from public.profiles
-- ############################################################
create function public.handle_delete_user()
returns trigger as $$ 
begin
  delete from public.profiles where id=old.id;
  return old;
end; $$ 
language plpgsql
security definer
SET search_path = '';

-- [trigger]
create trigger on_auth_user_deleted
after delete on auth.users
for each row execute procedure public.handle_delete_user();