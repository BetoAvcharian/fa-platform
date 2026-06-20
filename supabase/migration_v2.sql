-- =========================================================
-- MIGRACIÓN V2 — correr DESPUÉS de schema.sql, sobre la base
-- que ya está funcionando. No borra nada existente.
-- =========================================================

-- ---------------------------------------------------------
-- 1) CLIENTES — ficha súper completa (todo opcional salvo lo ya obligatorio)
-- ---------------------------------------------------------
alter table public.clientes
  add column if not exists tipo_persona text default 'fisica',          -- fisica | juridica
  add column if not exists cuit_cuil text,
  add column if not exists nacionalidad text,
  add column if not exists estado_civil text,
  add column if not exists profesion text,
  add column if not exists domicilio_calle text,
  add column if not exists domicilio_numero text,
  add column if not exists domicilio_piso text,
  add column if not exists domicilio_ciudad text,
  add column if not exists domicilio_provincia text,
  add column if not exists domicilio_pais text default 'Argentina',
  add column if not exists domicilio_cp text,
  add column if not exists email_alternativo text,
  add column if not exists telefono_alternativo text,
  add column if not exists pep boolean default false,                   -- persona expuesta políticamente
  add column if not exists ingresos_anuales_usd numeric(14,2),
  add column if not exists actividad_declarada text,
  add column if not exists banco_referencia text;

-- ---------------------------------------------------------
-- 2) CUENTAS — agregar COMITENTE como identificador de negocio
-- (separado del id interno, es el número con el que operás en el broker)
-- ---------------------------------------------------------
alter table public.cuentas
  add column if not exists comitente text;

create unique index if not exists idx_cuentas_comitente on public.cuentas(comitente) where comitente is not null;

-- ---------------------------------------------------------
-- 3) KYC — campos adicionales
-- ---------------------------------------------------------
alter table public.kyc
  add column if not exists pep boolean default false,
  add column if not exists ingresos_anuales_usd numeric(14,2),
  add column if not exists banco_referencia text,
  add column if not exists declaracion_jurada boolean default false,
  add column if not exists fecha_declaracion date;

-- ---------------------------------------------------------
-- 4) COMISIONES (histórico por comitente, mes/año cerrado)
-- ---------------------------------------------------------
create table if not exists public.comisiones (
  id uuid primary key default uuid_generate_v4(),
  periodo_mes int not null check (periodo_mes between 1 and 12),
  periodo_anio int not null,
  comitente text,                      -- nullable: premios al asesor no tienen comitente
  owner_id uuid not null references public.usuarios(id),
  concepto text,                       -- ej: "Comisión retención", "Premio asesor"
  monto numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_comisiones_owner on public.comisiones(owner_id, periodo_anio, periodo_mes);
create index if not exists idx_comisiones_comitente on public.comisiones(comitente);

alter table public.comisiones enable row level security;
create policy comisiones_select on public.comisiones for select using (
  owner_id = auth.uid()
  or public.fn_rol() = 'admin'
  or (public.fn_rol() = 'manager' and owner_id in (select public.fn_equipo(auth.uid())))
);
create policy comisiones_insert on public.comisiones for insert with check (
  owner_id = auth.uid() or public.fn_rol() in ('admin','manager')
);

-- ---------------------------------------------------------
-- 5) LICITACIONES (colocaciones primarias) + ÓRDENES por cliente
-- ---------------------------------------------------------
create type licitacion_estado_orden as enum ('tentativo', 'confirmada', 'cancelada', 'cargada');
create type moneda_tipo as enum ('USD', 'USDC', 'PESOS');

create table public.licitaciones (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.usuarios(id),
  nombre text not null,
  instrumento text,
  fecha_licitacion date,
  fecha_liquidacion date,
  moneda_base moneda_tipo default 'USD',
  created_at timestamptz not null default now()
);
create index idx_licitaciones_owner on public.licitaciones(owner_id);

create table public.licitacion_ordenes (
  id uuid primary key default uuid_generate_v4(),
  licitacion_id uuid not null references public.licitaciones(id) on delete cascade,
  cliente_id uuid not null references public.clientes(id),
  monto numeric(14,2) not null default 0,
  moneda moneda_tipo not null default 'USD',
  estado licitacion_estado_orden not null default 'tentativo',
  comentario text,
  created_at timestamptz not null default now()
);
create index idx_ordenes_licitacion on public.licitacion_ordenes(licitacion_id);

alter table public.licitaciones enable row level security;
alter table public.licitacion_ordenes enable row level security;

create policy licitaciones_select on public.licitaciones for select using (owner_id = auth.uid());
create policy licitaciones_modify on public.licitaciones for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy ordenes_select on public.licitacion_ordenes for select using (
  licitacion_id in (select id from public.licitaciones where owner_id = auth.uid())
);
create policy ordenes_modify on public.licitacion_ordenes for all using (
  licitacion_id in (select id from public.licitaciones where owner_id = auth.uid())
) with check (
  licitacion_id in (select id from public.licitaciones where owner_id = auth.uid())
);
