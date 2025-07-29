create table public.menus (
  id serial not null,
  name text,
  description text,
  price numeric,
  discount numeric,
  image_url text,
  category text,
  is_available boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key(id)
);

-- Untuk mengaktifkan Row Level Security:
alter table public.menus enable row level security;