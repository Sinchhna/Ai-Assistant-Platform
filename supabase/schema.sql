-- Auth-dependent tables and RLS for assistants, conversations, and messages

-- Enable UUID/crypto extensions if needed (safe to run multiple times)
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

-- Profiles (optional)
create table if not exists public.profiles (
	id uuid primary key references auth.users(id) on delete cascade,
	full_name text,
	created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner" on public.profiles
	for select using (auth.uid() = id);

drop policy if exists "Profiles are insertable by owner" on public.profiles;
create policy "Profiles are insertable by owner" on public.profiles
	for insert with check (auth.uid() = id);

drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner" on public.profiles
	for update using (auth.uid() = id);

-- Assistants
create table if not exists public.assistants (
	id uuid primary key default gen_random_uuid(),
	owner_id uuid not null references auth.users(id) on delete cascade,
	name text not null,
	description text not null,
	category text not null,
	image_url text,
	created_at timestamp with time zone default now()
);

alter table public.assistants enable row level security;

create index if not exists assistants_owner_id_idx on public.assistants(owner_id);
-- Map frontend model.id to DB via external_id
alter table public.assistants add column if not exists external_id text;
create unique index if not exists assistants_owner_external_uidx on public.assistants(owner_id, external_id);

drop policy if exists "Assistants are viewable by owner" on public.assistants;
create policy "Assistants are viewable by owner" on public.assistants
	for select using (auth.uid() = owner_id);

drop policy if exists "Assistants are insertable by owner" on public.assistants;
create policy "Assistants are insertable by owner" on public.assistants
	for insert with check (auth.uid() = owner_id);

drop policy if exists "Assistants are updatable by owner" on public.assistants;
create policy "Assistants are updatable by owner" on public.assistants
	for update using (auth.uid() = owner_id);

drop policy if exists "Assistants are deletable by owner" on public.assistants;
create policy "Assistants are deletable by owner" on public.assistants
	for delete using (auth.uid() = owner_id);

-- Conversations
create table if not exists public.conversations (
	id uuid primary key default gen_random_uuid(),
	owner_id uuid not null references auth.users(id) on delete cascade,
	assistant_id uuid not null references public.assistants(id) on delete cascade,
	title text,
	created_at timestamp with time zone default now()
);

alter table public.conversations enable row level security;

create index if not exists conversations_owner_id_idx on public.conversations(owner_id);
create index if not exists conversations_assistant_id_idx on public.conversations(assistant_id);

drop policy if exists "Conversations are viewable by owner" on public.conversations;
create policy "Conversations are viewable by owner" on public.conversations
	for select using (auth.uid() = owner_id);

drop policy if exists "Conversations are insertable by owner" on public.conversations;
create policy "Conversations are insertable by owner" on public.conversations
	for insert with check (auth.uid() = owner_id);

drop policy if exists "Conversations are updatable by owner" on public.conversations;
create policy "Conversations are updatable by owner" on public.conversations
	for update using (auth.uid() = owner_id);

drop policy if exists "Conversations are deletable by owner" on public.conversations;
create policy "Conversations are deletable by owner" on public.conversations
	for delete using (auth.uid() = owner_id);

-- Messages
create table if not exists public.messages (
	id uuid primary key default gen_random_uuid(),
	conversation_id uuid not null references public.conversations(id) on delete cascade,
	owner_id uuid not null references auth.users(id) on delete cascade,
	role text not null check (role in ('user','assistant','system')),
	content text not null,
	created_at timestamp with time zone default now()
);

alter table public.messages enable row level security;

create index if not exists messages_conversation_id_idx on public.messages(conversation_id);
create index if not exists messages_owner_id_idx on public.messages(owner_id);

drop policy if exists "Messages are viewable by owner" on public.messages;
create policy "Messages are viewable by owner" on public.messages
	for select using (auth.uid() = owner_id);

drop policy if exists "Messages are insertable by owner" on public.messages;
create policy "Messages are insertable by owner" on public.messages
	for insert with check (auth.uid() = owner_id);

drop policy if exists "Messages are deletable by owner" on public.messages;
create policy "Messages are deletable by owner" on public.messages
	for delete using (auth.uid() = owner_id);

-- Ensure roles have privileges (RLS still enforced)
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.assistants to authenticated;
grant select, insert, update, delete on public.conversations to authenticated;
grant select, insert, update, delete on public.messages to authenticated;


