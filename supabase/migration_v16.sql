-- =========================================================
-- MIGRACIÓN V16 — Hogares (grupos familiares)
-- Permite agrupar clientes relacionados aunque no compartan
-- ninguna cuenta, para ver AUM y actividad combinada.
-- =========================================================
create table public.hogares (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.usuarios(id),
  nombre text not null,
  created_at timestamptz not null default now()
);

alter table public.clientes
  add column if not exists hogar_id uuid references public.hogares(id) on delete set null;

create index idx_clientes_hogar on public.clientes(hogar_id);

alter table public.hogares enable row level security;

create policy hogares_select on public.hogares for select using (
  owner_id = auth.uid()
  or public.fn_rol() = 'admin'
  or (public.fn_rol() = 'manager' and owner_id in (select public.fn_equipo(auth.uid())))
);
create policy hogares_modify on public.hogares for all using (
  owner_id = auth.uid()
  or public.fn_rol() = 'admin'
  or (public.fn_rol() = 'manager' and owner_id in (select public.fn_equipo(auth.uid())))
) with check (
  owner_id = auth.uid() or public.fn_rol() in ('admin', 'manager')
);
