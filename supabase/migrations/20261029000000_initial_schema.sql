-- ==============================================================================
-- Ping Me: Initial Database Schema & Row Level Security (RLS)
-- Copy and paste this directly into Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Create Profiles table (Linked to Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  stripe_customer_id text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Create Vehicles table
create table if not exists public.vehicles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  license_plate text not null,
  make_model text not null,
  color text not null,
  duration_years integer default 2 not null,
  expires_at timestamptz default (now() + interval '2 years') not null,
  created_at timestamptz default now() not null
);

-- Index on license plate for fast lookups
create index if not exists idx_vehicles_user_id on public.vehicles(user_id);
create index if not exists idx_vehicles_license_plate on public.vehicles(license_plate);

-- 3. Create Tags table (Stickers with random secure tokens)
create table if not exists public.tags (
  id uuid default gen_random_uuid() primary key,
  token text not null unique,
  user_id uuid references public.profiles(id) on delete cascade not null,
  vehicle_id uuid references public.vehicles(id) on delete cascade,
  channel text not null check (channel in ('whatsapp', 'sms', 'email')) default 'whatsapp',
  destination_phone text,
  destination_email text,
  status text not null check (status in ('active', 'inactive')) default 'active',
  created_at timestamptz default now() not null
);

-- Index on token for instant QR scan lookups
create index if not exists idx_tags_token on public.tags(token);
create index if not exists idx_tags_user_id on public.tags(user_id);

-- 4. Create Alerts table (Incoming messages from QR scans)
create table if not exists public.alerts (
  id uuid default gen_random_uuid() primary key,
  tag_id uuid references public.tags(id) on delete cascade not null,
  preset_key text not null,
  custom_note text,
  sender_phone text,
  sender_email text,
  status text not null check (status in ('queued', 'delivered', 'failed')) default 'delivered',
  created_at timestamptz default now() not null
);

create index if not exists idx_alerts_tag_id on public.alerts(tag_id);

-- ==============================================================================
-- 5. Row Level Security (RLS) Policies (Strict GDPR & Privacy Guardrails)
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.tags enable row level security;
alter table public.alerts enable row level security;

-- Profiles Policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Vehicles Policies
create policy "Users can manage their own vehicles"
  on public.vehicles for all
  using (auth.uid() = user_id);

-- Tags Policies
-- 1. Owners have full control of their tags
create policy "Owners can manage their tags"
  on public.tags for all
  using (auth.uid() = user_id);

-- 2. Anyone (anonymous passerby) can view active tag metadata to confirm the car
create policy "Public can view active tag info"
  on public.tags for select
  using (status = 'active');

-- Alerts Policies
-- 1. Anyone (anonymous passerby) can insert an alert when scanning a QR code
create policy "Public can submit alerts to active tags"
  on public.alerts for insert
  with check (
    exists (
      select 1 from public.tags
      where tags.id = alerts.tag_id
      and tags.status = 'active'
    )
  );

-- 2. Tag owner can view alerts sent to their vehicle
create policy "Owners can view alerts for their tags"
  on public.alerts for select
  using (
    exists (
      select 1 from public.tags
      where tags.id = alerts.tag_id
      and tags.user_id = auth.uid()
    )
  );

-- ==============================================================================
-- 6. Automatic Profile Creation Trigger on Sign Up
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger whenever a user signs in with Magic Link or signs up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
