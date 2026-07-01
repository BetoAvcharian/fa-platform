# Wealth CRM — Wealth Management CRM

CRM para Financial Advisors y equipos de Wealth Management. Next.js 15 + TypeScript + Tailwind + Supabase (Postgres + Auth + Storage + RLS) + Recharts.

---

## Stack técnico

- **Next.js 15** (App Router, Server Components)
- **TypeScript**
- **Tailwind CSS** + componentes propios estilo shadcn (en `src/components/ui`)
- **Supabase**: base de datos Postgres, autenticación, row-level security (RLS), storage de archivos
- **Recharts**: gráficos
- **SheetJS (xlsx)**: importar/exportar Excel
- Deploy en **Vercel**, código en **GitHub**

---

## Estructura del proyecto

```
src/
  app/
    login/, signup/, forgot-password/, reset-password/   -> páginas públicas (sin sidebar)
    (app)/                                                 -> todo lo que requiere estar logueado
      dashboard/
      clientes/[id]/        -> Cliente 360 (ficha completa)
      clientes/, prospectos/, ex-clientes/    -> 3 vistas de la misma tabla `clientes`, filtradas por tipo/estado
      licitaciones/[id]/, licitaciones/
      tareas/
      resumen-dia/           -> registro rápido de contactos diarios + crear tareas de seguimiento
      oportunidades/         -> alertas automáticas
      comisiones/            -> histórico de comisiones, resumido por cliente y mes
      reportes/
      importador/            -> carga masiva de Clientes, Patrimonio, Comisiones
      usuarios/              -> solo Admin: crear/editar/eliminar usuarios y equipos
    api/admin/                -> rutas de servidor para crear/eliminar usuarios (usan la service_role key)
  components/
    ui/                      -> primitivos (button, card, table, tabs, dialog, badge, input, select)
    layout/                  -> sidebar, buscador global
    crm/                     -> el resto de los componentes específicos del negocio
  lib/
    supabase/
      client.ts              -> cliente de Supabase para componentes de navegador
      server.ts               -> cliente de Supabase para Server Components (usa cookies)
      admin.ts                -> cliente con la service_role key, SOLO se usa en rutas /api (servidor)
      fetch-all.ts            -> helper para traer más de 1000 filas sin que Supabase las corte
    types/                    -> tipos TS que reflejan el esquema de la base
supabase/
  schema.sql                  -> esquema original completo (correr una sola vez, en un proyecto nuevo)
  migration_v2.sql .. v10.sql  -> migraciones incrementales, correr en orden la primera vez
  (otros .sql)                 -> scripts puntuales de carga de datos o arreglos (no son parte del esquema base)
```

---

## Cómo levantarlo de cero (proyecto Supabase nuevo)

### 1. Crear proyecto en Supabase
1. https://supabase.com → New Project
2. SQL Editor → correr, **en este orden**, todo `supabase/schema.sql` y después cada `migration_v2.sql` a `migration_v10.sql`
3. Authentication → Providers → dejar Email habilitado

### 2. Crear tu usuario
1. Authentication → Users → Add user → email + password, **tildar "Auto Confirm User"**
2. SQL Editor:
   ```sql
   update public.usuarios set rol = 'admin' where email = 'tu@email.com';
   ```

### 3. Crear el bucket de documentos
1. Storage → New bucket → nombre `documentos-clientes` → **Private** (no tildar "Public bucket")
2. Correr `supabase/migration_v3.sql` (políticas de ese bucket)

### 4. Variables de entorno
Copiá `.env.local.example` a `.env.local` y completá con los datos de Settings → API de tu proyecto:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (necesaria para crear/eliminar usuarios desde la pantalla de Usuarios)

### 5. Local
```bash
npm install
npm run dev
```

### 6. Deploy en Vercel
1. Subir el código a un repo de GitHub (privado)
2. Vercel → Add New → Project → importar el repo
3. Agregar las mismas 3 variables de entorno
4. Framework Preset: **Next.js**, Root Directory: vacío
5. Deploy

---

## Roles y permisos

| Rol | Ve |
|---|---|
| **FA** | Solo sus propios clientes, tareas, licitaciones |
| **Manager** | Lo de su equipo (los FA con `manager_id` = él) |
| **Admin** | Todo, sin filtro. Único rol que ve la pantalla **Usuarios** |

Un "equipo" no es una entidad separada: es simplemente un Manager + los FA que tengan ese Manager asignado en su perfil (desde Usuarios). Esto se controla con Row Level Security directamente en la base — no es solo una restricción de la interfaz, está garantizado a nivel de base de datos.

---

## Modelo de datos — lo no obvio

- **`clientes`**: una sola tabla para Clientes, Prospectos y Ex Clientes. Se diferencian por `tipo` (cliente/prospecto) y `estado` (activo/inactivo/perdido). Las 3 pantallas del menú son la misma tabla, filtrada distinto.
- **`cuentas`**: una cuenta/comitente. No tiene un dueño único — para saber de quién es, hay que pasar por:
- **`cuenta_titulares`**: tabla intermedia (cuenta_id, cliente_id). Una cuenta puede tener 1 o 2 titulares (cuentas mancomunadas). Para cualquier cálculo agregado (totales, Top, Pareto), si una cuenta tiene 2 titulares se divide el valor entre ambos para no duplicar el total. En la ficha individual de cada cliente (Cliente 360), en cambio, se muestra el valor completo de la cuenta (es lo correcto para esa vista).
- **`patrimonio`**: histórico de AUM, nunca se sobrescribe — cada importación agrega una fila nueva con su fecha. El AUM "actual" siempre es el valor más reciente por cuenta.
- **`comisiones`**: una fila por comitente/mes/año (puede haber varias filas para el mismo comitente en el mismo mes, se suman). `comitente = null` significa premio al asesor sin cliente asociado.
- **Vistas `v_comisiones_*`**: pre-calculan sumas en la base en vez de traer todas las operaciones a la app. Si necesitás otro corte de comisiones que no esté cubierto, es mejor agregar una vista nueva que traer todo y sumar en el código.
- **`historial_cliente`**: se llena solo, con un trigger, cada vez que cambia `tipo` o `estado` de un cliente.

---

## Decisiones de performance importantes

- **Límite de 1000 filas de Supabase**: por defecto, cualquier consulta a la API de Supabase corta en 1000 filas, sin avisar. Para tablas que pueden crecer mucho (`comisiones`, `patrimonio`, `clientes` con el tiempo), el código usa `fetchAllRows()` (en `src/lib/supabase/fetch-all.ts`), que pagina automáticamente hasta traer todo. Cualquier consulta nueva a una tabla que pueda superar las 1000 filas algún día debería usar este helper.
- **Comisiones agregadas en la base, no en el código**: Dashboard, Reportes y el módulo de Comisiones nunca traen las operaciones individuales — consultan vistas SQL que ya devuelven los totales sumados (`v_comisiones_por_mes`, `v_comisiones_por_cliente_mes`, `v_comisiones_sin_cliente_por_mes`). Esto evita traer miles de filas a la app solo para sumarlas.
- **Búsqueda con debounce**: los buscadores de texto (Clientes, Prospectos, buscador global) no actualizan la URL ni disparan consultas en cada letra tipeada — esperan unos 300-400ms de pausa, así no se traba la escritura.

---

## Notas de UX/negocio

- **Tipo de cliente vs Estado**: cambiar el Tipo (Prospecto a Cliente) desde la ficha mueve automáticamente a la persona de la sección Prospectos a Clientes (es la misma tabla, filtro distinto). Cambiar el Estado a "Perdido" la mueve a Ex Clientes.
- **Plaza de la cuenta** (Local / BCI / StoneX / Pershing) determina si el AUM de esa cuenta cuenta como "Local" u "Offshore" en Reportes.
- **Eliminar registros**: Clientes, Usuarios y Prospectos (al "Descartar") piden escribir ELIMINAR para confirmar. Cuentas tiene una confirmación más simple.
- **Crear/eliminar usuarios** pasa por rutas de servidor (`/api/admin/*`) que usan la service_role key — esto es necesario porque crear un usuario desde el navegador con las claves normales cerraría la sesión del admin actual.

---

## Historial de migraciones (para entender el por qué de cada una)

| Migración | Qué resuelve |
|---|---|
| v2 | Ficha de cliente completa (domicilio, compliance, etc.), comitente, comisiones, licitaciones |
| v3 | Políticas de Storage para documentos por cliente |
| v4 | Campo "Referenciado por" |
| v5 | Flag "Trabajando" para prospectos |
| v6 | Plaza/custodio en cuentas, historial automático de cambios |
| v7 | Cuentas con múltiples titulares (`cuenta_titulares`) — antes una cuenta era de un solo cliente |
| v8 | Arregla un bug de permisos al crear una cuenta nueva |
| v9 | Vistas de comisiones pre-agregadas (evitar traer todo a la app) |
| v10 | Corrige doble conteo de cuentas mancomunadas en las vistas de comisiones |

---

## Qué falta / ideas para más adelante

- Importador de Movimientos (mismo patrón que Patrimonio y Comisiones)
- Ranking de Managers/FAs (vista de equipo para Manager/Admin)
- Login con Google
- Buscador con resultados por relevancia en vez de solo "empieza con"
