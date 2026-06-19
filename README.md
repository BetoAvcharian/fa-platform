# FA Platform — Wealth Management CRM

CRM para Financial Advisors y equipos de Wealth Management. Next.js 15 + TypeScript + Tailwind + shadcn-style components + Supabase (DB + Auth + RLS) + Recharts.

## Qué está hecho en esta fase

- **Auth** completo con Supabase (login, middleware que protege rutas, roles)
- **Schema SQL completo** con los 9 módulos del brief (usuarios, clientes, cuentas, kyc, interacciones, tareas, patrimonio, movimientos) + **Row Level Security** para Admin / Manager / FA
- **Dashboard**: AUM total, clientes/prospectos activos, tareas pendientes, clientes sin contacto 30/60/90 días, gráfico de evolución de AUM, alertas
- **CRM Clientes**: tabla con filtros (nombre, tipo, estado) + vista **Cliente 360** con tabs (Perfil, Cuentas, KYC, Interacciones, Patrimonio, Tareas, Oportunidades)
- **Pipeline comercial**: kanban con drag & drop entre las 7 etapas, valor potencial por columna
- **Tareas**: vista lista con prioridad y estado
- **Oportunidades**: motor de alertas (sin contacto +60/+90 días, tareas vencidas)
- **Importador de patrimonio**: sube Excel, valida, **siempre inserta** (nunca pisa histórico)
- **Reportes**: vista básica por rol
- Sidebar colapsable, dark/light mode, formato de moneda en USD

## Qué falta para fase 2 (decime qué priorizar)

- Importador de movimientos (mismo patrón que patrimonio)
- Reportes de Manager (ranking advisors, conversión pipeline) y vista global Admin
- Formularios de alta/edición de Cliente, Cuenta, KYC, Interacción, Tarea (hoy se ve todo, falta el CRUD desde la UI — por ahora se prueba insertando filas desde Supabase o el seed)
- Calendario de tareas
- Reasignación de clientes (Manager)
- Integraciones futuras: Outlook, WhatsApp Business, APIs de custodios, IA

## Cómo levantarlo (vos de tu lado)

### 1. Crear proyecto en Supabase
1. Entrá a https://supabase.com → New Project
2. Cuando esté listo, vas a **SQL Editor** → pegás todo el contenido de `supabase/schema.sql` → Run
3. En **Authentication → Providers**, dejá Email habilitado
4. Creá tu primer usuario: Authentication → Users → Add user (con email/password). El trigger crea automáticamente la fila en `public.usuarios` con rol `fa`.
5. Para que tu usuario sea Admin: en SQL Editor corré
   ```sql
   update public.usuarios set rol = 'admin' where email = 'tu@email.com';
   ```
6. (Opcional) Cargá datos de prueba: abrí `supabase/seed.sql`, reemplazá `TU_USER_ID` por tu id real (lo ves en Authentication → Users) y corrélo en SQL Editor.

### 2. Variables de entorno
1. Copiá `.env.local.example` a `.env.local`
2. Completá con los datos de tu proyecto Supabase (Settings → API):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 3. Instalar y correr local
```bash
npm install
npm run dev
```
Abrí http://localhost:3000 — te va a redirigir a `/login`.

### 4. Deploy en Vercel
1. Subí esta carpeta a un repo de GitHub
2. En https://vercel.com → New Project → importá el repo
3. Agregá las mismas 3 variables de entorno en Vercel (Settings → Environment Variables)
4. Deploy

## Estructura

```
src/
  app/
    login/              -> pantalla de login
    (app)/               -> rutas protegidas (sidebar + layout)
      dashboard/
      clientes/[id]/      -> Cliente 360
      pipeline/
      tareas/
      oportunidades/
      reportes/
      importador/
  components/
    ui/                  -> primitivos (button, card, table, tabs, badge, input)
    layout/sidebar.tsx
    crm/                 -> tablas, kanban, charts, importador
  lib/
    supabase/            -> client.ts (browser), server.ts (server components)
    types/                -> tipos TS que reflejan el schema
supabase/
  schema.sql             -> CORRER ESTO PRIMERO en Supabase
  seed.sql                -> datos de prueba opcionales
```

## Notas importantes

- El **histórico de patrimonio y movimientos nunca se sobrescribe** — cada importación inserta filas nuevas con su `fecha_carga`/`fecha`. El AUM "actual" en el dashboard toma la fecha más reciente.
- Los **número de cuenta** son el campo puente entre `patrimonio`/`movimientos` y `cuentas` — si tu fuente de datos usa otro identificador, avisame y ajustamos.
- RLS está escrito para que un FA solo vea lo suyo, un Manager vea lo de su equipo (`manager_id`), y Admin vea todo. Lo probé a nivel de policies SQL; cuando tengas más de un usuario real cargado, lo probamos juntos extremo a extremo.
