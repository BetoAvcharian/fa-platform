-- =========================================================
-- FA PLATFORM — SCHEMA COMPLETO + RLS
-- Correr este archivo en el SQL Editor de Supabase (proyecto nuevo)
-- =========================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------
create type user_role as enum ('admin', 'manager', 'fa');
create type user_estado as enum ('activo', 'inactivo');
create type cliente_tipo as enum ('prospecto', 'cliente');
create type cliente_estado as enum ('activo', 'inactivo', 'perdido');
create type cuenta_estado as enum ('activa', 'inactiva', 'cerrada');
create type interaccion_tipo as enum ('llamada', 'email', 'reunion', 'whatsapp', 'nota');
create type tarea_prioridad as enum ('alta', 'media', 'baja');
create type tarea_estado as enum ('pendiente', 'en_progreso', 'completada');
create type movimiento_tipo as enum ('deposito', 'retiro', 'transferencia', 'otro');
create type pipeline_etapa as enum ('lead', 'contactado', 'reunion', 'kyc', 'apertura', 'fondeado', 'cliente_activo');

-- ---------------------------------------------------------
-- USUARIOS  (extiende auth.users de Supabase)
-- ---------------------------------------------------------
create table public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  apellido text not null,
  email text not null unique,
  rol user_role not null default 'fa',
  manager_id uuid references public.usuarios(id),
  estado user_estado not null default 'activo',
  created_at timestamptz not null default now()
);

-- helper: rol del usuario autenticado (evita recursión en policies)
create or replace function public.fn_rol() returns user_role
language sql security definer stable as $$
  select rol from public.usuarios where id = auth.uid();
$$;

-- helper: ids de advisors que reportan a un manager (incluido el propio manager)
create or replace function public.fn_equipo(p_manager uuid) returns setof uuid
language sql security definer stable as $$
  select id from public.usuarios where id = p_manager
  union
  select id from public.usuarios where manager_id = p_manager;
$$;

-- ---------------------------------------------------------
-- CLIENTES / PROSPECTOS
-- ---------------------------------------------------------
create table public.clientes (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.usuarios(id),
  tipo cliente_tipo not null default 'prospecto',
  nombre text not null,
  apellido text,
  razon_social text,
  documento text,
  email text,
  telefono text,
  fecha_nacimiento date,
  estado cliente_estado not null default 'activo',
  potencial_usd numeric(14,2) default 0,
  fecha_ultimo_contacto date,
  pipeline_etapa pipeline_etapa default 'lead',
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_clientes_owner on public.clientes(owner_id);

-- ---------------------------------------------------------
-- CUENTAS
-- ---------------------------------------------------------
create table public.cuentas (
  id uuid primary key default uuid_generate_v4(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  numero_cuenta text not null unique,
  tipo_cuenta text,
  estado_cuenta cuenta_estado not null default 'activa',
  created_at timestamptz not null default now()
);
create index idx_cuentas_cliente on public.cuentas(cliente_id);

-- ---------------------------------------------------------
-- KYC
-- ---------------------------------------------------------
create table public.kyc (
  id uuid primary key default uuid_generate_v4(),
  cuenta_id uuid not null references public.cuentas(id) on delete cascade,
  perfil_inversor text,
  experiencia_inversiones text,
  origen_fondos text,
  patrimonio_estimado numeric(14,2),
  fecha_actualizacion date default now()
);

-- ---------------------------------------------------------
-- INTERACCIONES
-- ---------------------------------------------------------
create table public.interacciones (
  id uuid primary key default uuid_generate_v4(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  usuario_id uuid not null references public.usuarios(id),
  fecha timestamptz not null default now(),
  tipo interaccion_tipo not null,
  asunto text,
  detalle text,
  proxima_accion text,
  fecha_proxima_accion date,
  created_at timestamptz not null default now()
);
create index idx_interacciones_cliente on public.interacciones(cliente_id);

-- ---------------------------------------------------------
-- TAREAS
-- ---------------------------------------------------------
create table public.tareas (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.usuarios(id),
  cliente_id uuid references public.clientes(id) on delete set null,
  titulo text not null,
  descripcion text,
  prioridad tarea_prioridad not null default 'media',
  fecha_vencimiento date,
  estado tarea_estado not null default 'pendiente',
  created_at timestamptz not null default now()
);
create index idx_tareas_owner on public.tareas(owner_id);

-- ---------------------------------------------------------
-- PATRIMONIO (histórico, nunca se sobrescribe)
-- ---------------------------------------------------------
create table public.patrimonio (
  id uuid primary key default uuid_generate_v4(),
  fecha_carga date not null default current_date,
  numero_cuenta text not null,
  aum numeric(16,2) not null default 0,
  cash numeric(16,2) not null default 0,
  created_at timestamptz not null default now()
);
create index idx_patrimonio_cuenta on public.patrimonio(numero_cuenta, fecha_carga);

-- ---------------------------------------------------------
-- MOVIMIENTOS (histórico)
-- ---------------------------------------------------------
create table public.movimientos (
  id uuid primary key default uuid_generate_v4(),
  fecha date not null,
  numero_cuenta text not null,
  tipo movimiento_tipo not null,
  monto numeric(16,2) not null,
  created_at timestamptz not null default now()
);
create index idx_movimientos_cuenta on public.movimientos(numero_cuenta, fecha);

-- trigger updated_at clientes
create or replace function public.fn_set_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger trg_clientes_updated_at before update on public.clientes
for each row execute function public.fn_set_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
alter table public.usuarios enable row level security;
alter table public.clientes enable row level security;
alter table public.cuentas enable row level security;
alter table public.kyc enable row level security;
alter table public.interacciones enable row level security;
alter table public.tareas enable row level security;
alter table public.patrimonio enable row level security;
alter table public.movimientos enable row level security;

-- USUARIOS: todos ven su propio perfil; manager ve su equipo; admin ve todo
create policy usuarios_select on public.usuarios for select using (
  id = auth.uid()
  or public.fn_rol() = 'admin'
  or (public.fn_rol() = 'manager' and manager_id = auth.uid())
);
create policy usuarios_update_admin on public.usuarios for update using (public.fn_rol() = 'admin');

-- CLIENTES: FA ve los suyos / manager ve los de su equipo / admin ve todo
create policy clientes_select on public.clientes for select using (
  owner_id = auth.uid()
  or public.fn_rol() = 'admin'
  or (public.fn_rol() = 'manager' and owner_id in (select public.fn_equipo(auth.uid())))
);
create policy clientes_insert on public.clientes for insert with check (
  owner_id = auth.uid() or public.fn_rol() in ('admin','manager')
);
create policy clientes_update on public.clientes for update using (
  owner_id = auth.uid()
  or public.fn_rol() = 'admin'
  or (public.fn_rol() = 'manager' and owner_id in (select public.fn_equipo(auth.uid())))
);
create policy clientes_delete on public.clientes for delete using (
  public.fn_rol() = 'admin'
);

-- CUENTAS: hereda visibilidad del cliente
create policy cuentas_select on public.cuentas for select using (
  cliente_id in (select id from public.clientes)
);
create policy cuentas_modify on public.cuentas for all using (
  cliente_id in (select id from public.clientes)
) with check (
  cliente_id in (select id from public.clientes)
);

-- KYC: hereda de cuenta -> cliente
create policy kyc_select on public.kyc for select using (
  cuenta_id in (select id from public.cuentas)
);
create policy kyc_modify on public.kyc for all using (
  cuenta_id in (select id from public.cuentas)
) with check (
  cuenta_id in (select id from public.cuentas)
);

-- INTERACCIONES: hereda del cliente
create policy interacciones_select on public.interacciones for select using (
  cliente_id in (select id from public.clientes)
);
create policy interacciones_modify on public.interacciones for all using (
  cliente_id in (select id from public.clientes)
) with check (
  cliente_id in (select id from public.clientes)
);

-- TAREAS: dueño / manager del equipo / admin
create policy tareas_select on public.tareas for select using (
  owner_id = auth.uid()
  or public.fn_rol() = 'admin'
  or (public.fn_rol() = 'manager' and owner_id in (select public.fn_equipo(auth.uid())))
);
create policy tareas_modify on public.tareas for all using (
  owner_id = auth.uid()
  or public.fn_rol() = 'admin'
  or (public.fn_rol() = 'manager' and owner_id in (select public.fn_equipo(auth.uid())))
) with check (
  owner_id = auth.uid() or public.fn_rol() in ('admin','manager')
);

-- PATRIMONIO / MOVIMIENTOS: visibles si la cuenta es visible (vía join lógico en queries);
-- a nivel RLS simple, lectura abierta a usuarios autenticados, escritura solo admin/manager
-- (el filtrado fino por owner se hace en la query uniendo con clientes/cuentas)
create policy patrimonio_select on public.patrimonio for select using (auth.role() = 'authenticated');
create policy patrimonio_insert on public.patrimonio for insert with check (public.fn_rol() in ('admin','manager','fa'));

create policy movimientos_select on public.movimientos for select using (auth.role() = 'authenticated');
create policy movimientos_insert on public.movimientos for insert with check (public.fn_rol() in ('admin','manager','fa'));

-- =========================================================
-- TRIGGER: crear fila en usuarios cuando se registra alguien en auth.users
-- =========================================================
create or replace function public.fn_handle_new_user() returns trigger
language plpgsql security definer as $$
begin
  insert into public.usuarios (id, nombre, apellido, email, rol)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', ''),
    coalesce(new.raw_user_meta_data->>'apellido', ''),
    new.email,
    'fa'
  );
  return new;
end;
$$;
create trigger trg_on_auth_user_created
after insert on auth.users
for each row execute function public.fn_handle_new_user();
