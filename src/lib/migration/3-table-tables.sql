create table public.tables (
    id serial not null,
    name text,
    description text,
    capacity numeric,
    status text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    primary key (id)
);

alter table public.tables enable row level security