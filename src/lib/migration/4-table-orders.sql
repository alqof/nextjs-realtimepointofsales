create table public.orders (
  id serial not null,
  order_id text,
  customer_name text,
  table_id integer references tables on delete set null,
  status text,
  payment_token text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  primary key (id)
);
alter table public.orders enable row level security;

create table public.orders_menus (
  id serial not null,
  order_id integer references orders on delete set null,
  menu_id integer references menus on delete set null,
  quantity integer,
  notes text,
  status text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  primary key (id)
);
alter table public.orders_menus enable row level security;