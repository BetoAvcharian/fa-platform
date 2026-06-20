export type UserRole = "admin" | "manager" | "fa";
export type ClienteTipo = "prospecto" | "cliente";
export type ClienteEstado = "activo" | "inactivo" | "perdido";
export type PipelineEtapa =
  | "lead"
  | "contactado"
  | "reunion"
  | "kyc"
  | "apertura"
  | "fondeado"
  | "cliente_activo";
export type InteraccionTipo = "llamada" | "email" | "reunion" | "whatsapp" | "nota";
export type TareaPrioridad = "alta" | "media" | "baja";
export type TareaEstado = "pendiente" | "en_progreso" | "completada";

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: UserRole;
  manager_id: string | null;
  estado: "activo" | "inactivo";
}

export interface Cliente {
  id: string;
  owner_id: string;
  tipo: ClienteTipo;
  nombre: string;
  apellido: string | null;
  razon_social: string | null;
  documento: string | null;
  email: string | null;
  telefono: string | null;
  fecha_nacimiento: string | null;
  estado: ClienteEstado;
  potencial_usd: number;
  fecha_ultimo_contacto: string | null;
  pipeline_etapa: PipelineEtapa;
  notas: string | null;
  tipo_persona: "fisica" | "juridica" | null;
  cuit_cuil: string | null;
  nacionalidad: string | null;
  estado_civil: string | null;
  profesion: string | null;
  domicilio_calle: string | null;
  domicilio_numero: string | null;
  domicilio_piso: string | null;
  domicilio_ciudad: string | null;
  domicilio_provincia: string | null;
  domicilio_pais: string | null;
  domicilio_cp: string | null;
  email_alternativo: string | null;
  telefono_alternativo: string | null;
  pep: boolean | null;
  ingresos_anuales_usd: number | null;
  actividad_declarada: string | null;
  banco_referencia: string | null;
  referenciado_por: string | null;
  created_at: string;
  updated_at: string;
}

export type LicitacionEstadoOrden = "tentativo" | "confirmada" | "cancelada" | "cargada";
export type MonedaTipo = "USD" | "USDC" | "PESOS";

export interface Licitacion {
  id: string;
  owner_id: string;
  nombre: string;
  instrumento: string | null;
  fecha_licitacion: string | null;
  fecha_liquidacion: string | null;
  moneda_base: MonedaTipo;
  created_at: string;
}

export interface LicitacionOrden {
  id: string;
  licitacion_id: string;
  cliente_id: string;
  monto: number;
  moneda: MonedaTipo;
  estado: LicitacionEstadoOrden;
  comentario: string | null;
  created_at: string;
}

export interface Comision {
  id: string;
  periodo_mes: number;
  periodo_anio: number;
  comitente: string | null;
  owner_id: string;
  concepto: string | null;
  monto: number;
  created_at: string;
}

export const ESTADOS_ORDEN: { key: LicitacionEstadoOrden; label: string }[] = [
  { key: "tentativo", label: "Tentativo" },
  { key: "confirmada", label: "Confirmada" },
  { key: "cancelada", label: "Cancelada" },
  { key: "cargada", label: "Cargada" },
];

export const MONEDAS: MonedaTipo[] = ["USD", "USDC", "PESOS"];

export interface Cuenta {
  id: string;
  cliente_id: string;
  numero_cuenta: string;
  comitente: string | null;
  tipo_cuenta: string | null;
  estado_cuenta: "activa" | "inactiva" | "cerrada";
}

export interface Kyc {
  id: string;
  cuenta_id: string;
  perfil_inversor: string | null;
  experiencia_inversiones: string | null;
  origen_fondos: string | null;
  patrimonio_estimado: number | null;
  fecha_actualizacion: string | null;
}

export interface Interaccion {
  id: string;
  cliente_id: string;
  usuario_id: string;
  fecha: string;
  tipo: InteraccionTipo;
  asunto: string | null;
  detalle: string | null;
  proxima_accion: string | null;
  fecha_proxima_accion: string | null;
}

export interface Tarea {
  id: string;
  owner_id: string;
  cliente_id: string | null;
  titulo: string;
  descripcion: string | null;
  prioridad: TareaPrioridad;
  fecha_vencimiento: string | null;
  estado: TareaEstado;
}

export interface Patrimonio {
  id: string;
  fecha_carga: string;
  numero_cuenta: string;
  aum: number;
  cash: number;
}

export interface Movimiento {
  id: string;
  fecha: string;
  numero_cuenta: string;
  tipo: "deposito" | "retiro" | "transferencia" | "otro";
  monto: number;
}

export const PIPELINE_ETAPAS: { key: PipelineEtapa; label: string }[] = [
  { key: "lead", label: "Lead" },
  { key: "contactado", label: "Contactado" },
  { key: "reunion", label: "Reunión" },
  { key: "kyc", label: "KYC" },
  { key: "apertura", label: "Apertura" },
  { key: "fondeado", label: "Fondeado" },
  { key: "cliente_activo", label: "Cliente Activo" },
];
