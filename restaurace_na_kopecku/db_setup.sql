-- Create Menu Items Table
create table public.menu_items (
  id bigint generated always as identity primary key,
  name text not null,
  description text,
  price numeric(10,2),
  image_url text,
  is_visible boolean default true
);

-- Create Settings Table (for opening hours and popup)
create table public.settings (
  id bigint generated always as identity primary key,
  key text unique not null,
  value jsonb not null
);

-- Enable Row Level Security (RLS) - Recommended
alter table public.menu_items enable row level security;
alter table public.settings enable row level security;

-- Create Policies (Public Read, Admin Write)
-- Note: Adjust 'authenticated' role if you want stricter control
create policy "Public items are viewable by everyone" on public.menu_items
  for select using (true);

create policy "Authenticated users can insert items" on public.menu_items
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can update items" on public.menu_items
  for update using (auth.role() = 'authenticated');

create policy "Authenticated users can delete items" on public.menu_items
  for delete using (auth.role() = 'authenticated');

create policy "Public settings are viewable by everyone" on public.settings
  for select using (true);

create policy "Authenticated users can manage settings" on public.settings
  for all using (auth.role() = 'authenticated');
