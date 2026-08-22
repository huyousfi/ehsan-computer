create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null check (category in ('Laptops', 'Accessories')),
  brand text not null,
  condition text,
  price numeric not null,
  original_price numeric,
  in_stock boolean not null default true,
  stock_count integer not null default 0,
  is_featured boolean not null default false,
  image text,
  summary text,
  specs jsonb not null default '{}'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  id integer primary key default 1 check (id = 1),
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.store_settings enable row level security;

drop policy if exists "Anyone can view products" on public.products;
create policy "Anyone can view products"
on public.products for select
using (true);

drop policy if exists "Anyone can view settings" on public.store_settings;
create policy "Anyone can view settings"
on public.store_settings for select
using (true);

-- Run this once in the Supabase SQL Editor when products already exists.
-- Product rows must use category values exactly as shown below.
alter table public.products drop constraint if exists products_category_check;
alter table public.products add constraint products_category_check
  check (category in ('Laptops', 'Accessories'));

-- Write policies will be added after Supabase Auth is connected to the admin panel.
