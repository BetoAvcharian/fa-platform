-- =========================================================
-- MIGRACIÓN V6
-- 1) Plaza/custodio en cuentas (Local / BCI / StoneX / Pershing)
-- 2) Historial automático de cambios de tipo y estado en clientes
-- =========================================================

-- ---------------------------------------------------------
-- 1) PLAZA / CUSTODIO
-- ---------------------------------------------------------
create type plaza_tipo as enum ('local', 'bci', 'stonex', 'pershing');

alter table public.cuentas
  add column if not exists plaza plaza_tipo not null default 'local';

-- ---------------------------------------------------------
-- 2) HISTORIAL DE CAMBIOS (tipo y estado de clientes)
-- ---------------------------------------------------------
create table public.historial_cliente (
  id uuid primary key default uuid_generate_v4(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  campo text not null,            -- 'tipo' o 'estado'
  valor_anterior text,
  valor_nuevo text,
  usuario_id uuid references public.usuarios(id),
  fecha timestamptz not null default now()
);
create index idx_historial_cliente on public.historial_cliente(cliente_id, fecha desc);

alter table public.historial_cliente enable row level security;
create policy historial_select on public.historial_cliente for select using (
  cliente_id in (select id from public.clientes)
);

create or replace function public.fn_log_cambio_cliente() returns trigger
language plpgsql security definer as $$
begin
  if old.tipo is distinct from new.tipo then
    insert into public.historial_cliente (cliente_id, campo, valor_anterior, valor_nuevo, usuario_id)
    values (new.id, 'tipo', old.tipo::text, new.tipo::text, auth.uid());
  end if;
  if old.estado is distinct from new.estado then
    insert into public.historial_cliente (cliente_id, campo, valor_anterior, valor_nuevo, usuario_id)
    values (new.id, 'estado', old.estado::text, new.estado::text, auth.uid());
  end if;
  return new;
end;
$$;

create trigger trg_log_cambio_cliente
after update on public.clientes
for each row execute function public.fn_log_cambio_cliente();
