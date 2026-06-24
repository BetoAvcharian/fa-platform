-- =========================================================
-- MIGRACIÓN V17 — una tarea puede asociarse a varios clientes
-- =========================================================
create table public.tarea_clientes (
  tarea_id uuid not null references public.tareas(id) on delete cascade,
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  primary key (tarea_id, cliente_id)
);
create index idx_tarea_clientes_cliente on public.tarea_clientes(cliente_id);

-- migrar lo que ya estaba en tareas.cliente_id, para no perder nada
insert into public.tarea_clientes (tarea_id, cliente_id)
select id, cliente_id from public.tareas where cliente_id is not null
on conflict do nothing;

alter table public.tarea_clientes enable row level security;

create policy tarea_clientes_select on public.tarea_clientes for select using (
  tarea_id in (select id from public.tareas)
);
create policy tarea_clientes_modify on public.tarea_clientes for all using (
  tarea_id in (select id from public.tareas)
) with check (
  tarea_id in (select id from public.tareas)
);
