-- ============================================================
-- Supabase Schema: Rune & Blade Idle Online
-- วิธีใช้: เปิด Supabase Dashboard → SQL Editor → วาง + Run
-- ============================================================

-- ── Players (cloud save + leaderboard) ──────────────────────
create table if not exists public.players (
  id           uuid primary key default gen_random_uuid(),
  device_id    text unique not null,
  display_name text not null default 'นักผจญภัย',
  level        int  not null default 1,
  gold         bigint not null default 0,
  total_kills  bigint not null default 0,
  class_id     text,
  stage_id     text not null default 'prontera',
  save_data    jsonb,
  updated_at   timestamptz not null default now()
);

alter table public.players enable row level security;
create policy "players_all" on public.players for all using (true) with check (true);

-- ── Leaderboard view ─────────────────────────────────────────
create or replace view public.leaderboard as
  select
    row_number() over (order by level desc, total_kills desc) as rank,
    display_name, level, total_kills, gold, class_id, stage_id, updated_at
  from public.players
  order by level desc, total_kills desc
  limit 50;

-- ── Guilds ───────────────────────────────────────────────────
create table if not exists public.guilds (
  id          uuid primary key default gen_random_uuid(),
  name        text unique not null,
  tag         text not null,
  leader_id   uuid references public.players(id),
  created_at  timestamptz not null default now()
);
alter table public.guilds enable row level security;
create policy "guilds_select" on public.guilds for select using (true);
create policy "guilds_insert" on public.guilds for insert with check (true);
create policy "guilds_update" on public.guilds for update using (true);

-- ── Guild members ─────────────────────────────────────────────
create table if not exists public.guild_members (
  guild_id   uuid references public.guilds(id)  on delete cascade,
  player_id  uuid references public.players(id) on delete cascade,
  joined_at  timestamptz not null default now(),
  primary key (guild_id, player_id)
);
alter table public.guild_members enable row level security;
create policy "gm_select" on public.guild_members for select using (true);
create policy "gm_insert" on public.guild_members for insert with check (true);
create policy "gm_delete" on public.guild_members for delete using (true);

-- ── Guild chat ────────────────────────────────────────────────
create table if not exists public.guild_chat (
  id           uuid primary key default gen_random_uuid(),
  guild_id     uuid references public.guilds(id) on delete cascade,
  player_id    uuid references public.players(id) on delete cascade,
  display_name text not null,
  message      text not null,
  created_at   timestamptz not null default now()
);
alter table public.guild_chat enable row level security;
create policy "gc_select" on public.guild_chat for select using (true);
create policy "gc_insert" on public.guild_chat for insert with check (true);

-- Enable Realtime
alter publication supabase_realtime add table public.guild_chat;
alter publication supabase_realtime add table public.players;
