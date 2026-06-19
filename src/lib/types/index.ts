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
  created_at: string;
  updated_at: string;
}

export interface Cuenta {
  id: string;
  cliente_id: string;
  numero_cuenta: string;
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
