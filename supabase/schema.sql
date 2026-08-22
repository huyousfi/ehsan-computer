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

-- Keep this constraint in sync when products already exists.
alter table public.products drop constraint if exists products_category_check;
alter table public.products add constraint products_category_check
  check (category in ('Laptops', 'Accessories'));

-- The admin PIN is currently checked in the browser, so these policies allow
-- the current admin form to write products. Add Supabase Auth before production use.
drop policy if exists "Anyone can insert products" on public.products;
create policy "Anyone can insert products"
on public.products for insert
with check (true);

drop policy if exists "Anyone can update products" on public.products;
create policy "Anyone can update products"
on public.products for update
using (true)
with check (true);

drop policy if exists "Anyone can delete products" on public.products;
create policy "Anyone can delete products"
on public.products for delete
using (true);

-- Test insert: run this after the schema above. The category spelling is required.
insert into public.products (
  id, name, category, brand, condition, price, in_stock, stock_count,
  is_featured, image, summary, specs, tags
)
values (
  'test-product-001',
  'Test Laptop',
  'Laptops',
  'Dell',
  'Brand New',
  100000,
  true,
  1,
  false,
  '',
  'Test product',
  '{}'::jsonb,
  '[]'::jsonb
)
on conflict (id) do nothing;
