create table public.menus (
  id serial primary key,
  name text,
  description text,
  price numeric,
  discount numeric,
  image_url text,
  category text,
  is_available boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Untuk mengaktifkan Row Level Security:
alter table public.menus enable row level security;