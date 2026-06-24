import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { formatUSD, formatNumberAR } from "@/lib/utils";
import { DocumentosCliente } from "@/components/crm/documentos-cliente";
import { NuevoClienteDialog } from "@/components/crm/nuevo-cliente-dialog";
import { BackButton } from "@/components/ui/back-button";
import { WhatsappButton } from "@/components/crm/whatsapp-button";
import { AgregarCuentaDialog } from "@/components/crm/agregar-cuenta-dialog";
import { EditarCuentaDialog } from "@/components/crm/editar-cuenta-dialog";
import { ActualizarSaldoDialog } from "@/components/crm/actualizar-saldo-dialog";
import { HogarWidget } from "@/components/crm/hogar-widget";
import { EliminarClienteDialog } from "@/components/crm/eliminar-cliente-dialog";
import { PLAZAS } from "@/lib/types";

export default async function ClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: cliente }, { data: cuentaTitulares }, { data: interacciones }, { data: tareas }, { data: historial }] =
    await Promise.all([
      supabase.from("clientes").select("*").eq("id", id).single(),
      supabase.from("cuenta_titulares").select("rol_titular, cuentas:cuenta_id (*)").eq("cliente_id", id),
      supabase.from("interacciones").select("*").eq("cliente_id", id).order("fecha", { ascending: false }),
      supabase.from("tareas").select("*").eq("cliente_id", id).order("fecha_vencimiento", { ascending: true }),
      supabase.from("historial_cliente").select("*, usuarios:usuario_id (nombre, apellido)").eq("cliente_id", id).order("fecha", { ascending: false }),
    ]);
  if (!cliente) notFound();

  const cuentas = (cuentaTitulares ?? []).map((ct: any) => ({ ...ct.cuentas, rol_titular: ct.rol_titular }));
  const numerosCuenta = cuentas.map((c) => c.numero_cuenta);
  const cuentaIds = cuentas.map((c: any) => c.id);

  const hoy = new Date();
  let mesAnterior = hoy.getMonth(); // 0-indexed; mes pasado cerrado
  let anioAnterior = hoy.getFullYear();
  if (mesAnterior === 0) { mesAnterior = 12; anioAnterior -= 1; }

  const [{ data: otrosTitulares }, { data: kycRows }, { data: patrimonio }, { data: comisionesCuentas }, { data: hogaresDisponibles }, hogarInfoResult, miembrosResult] = await Promise.all([
    cuentaIds.length
      ? supabase.from("cuenta_titulares").select("cuenta_id, clientes:cliente_id (id, nombre, apellido)").in("cuenta_id", cuentaIds).neq("cliente_id", id)
      : Promise.resolve({ data: [] as any[] }),
    cuentaIds.length
      ? supabase.from("kyc").select("*, cuentas:cuenta_id(numero_cuenta)").in("cuenta_id", cuentaIds)
      : Promise.resolve({ data: [] as any[] }),
    numerosCuenta.length
      ? supabase.from("patrimonio").select("*").in("numero_cuenta", numerosCuenta).order("fecha_carga", { ascending: false })
      : Promise.resolve({ data: [] as any[] }),
    numerosCuenta.length
      ? supabase.from("comisiones").select("*").in("comitente", numerosCuenta).eq("periodo_mes", mesAnterior).eq("periodo_anio", anioAnterior)
      : Promise.resolve({ data: [] as any[] }),
    supabase.from("hogares").select("id, nombre").order("nombre"),
    cliente.hogar_id
      ? supabase.from("hogares").select("nombre").eq("id", cliente.hogar_id).single()
      : Promise.resolve({ data: null as any }),
    cliente.hogar_id
      ? supabase.from("clientes").select("id, nombre, apellido, potencial_usd").eq("hogar_id", cliente.hogar_id)
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const hogarInfo = (hogarInfoResult as any)?.data ?? null;
  const miembrosHogar = ((miembrosResult as any)?.data ?? []).map((m: any) => ({
    id: m.id,
    nombre: m.nombre,
    apellido: m.apellido,
    potencial: Number(m.potencial_usd ?? 0),
  }));

  const aumTotal = (patrimonio ?? [])
    .filter((p, i, arr) => arr.findIndex((x) => x.numero_cuenta === p.numero_cuenta) === i)
    .reduce((sum, p) => sum + Number(p.aum), 0);

  const cuentasLocales = new Set(cuentas.filter((c) => c.plaza === "local").map((c) => c.numero_cuenta));
  const aumLocal = (patrimonio ?? [])
    .filter((p, i, arr) => arr.findIndex((x) => x.numero_cuenta === p.numero_cuenta) === i)
    .filter((p) => cuentasLocales.has(p.numero_cuenta))
    .reduce((sum, p) => sum + Number(p.aum), 0);
  const aumOffshore = aumTotal - aumLocal;

  const aumPorCuentaIndividual = new Map<string, number>();
  (patrimonio ?? []).forEach((p) => {
    if (!aumPorCuentaIndividual.has(p.numero_cuenta)) aumPorCuentaIndividual.set(p.numero_cuenta, Number(p.aum));
  });

  const comisionPorCuenta = new Map<string, number>();
  (comisionesCuentas ?? []).forEach((com) => {
    if (!com.comitente) return;
    comisionPorCuenta.set(com.comitente, (comisionPorCuenta.get(com.comitente) ?? 0) + Number(com.monto));
  });

  return (
    <div className="space-y-6">
      <BackButton label="Volver a clientes" />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">{cliente.nombre} {cliente.apellido}</h1>
          <p className="text-sm text-muted-foreground">{cliente.email ?? "Sin email"} · {cliente.telefono ?? "Sin teléfono"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={cliente.tipo === "cliente" ? "accent" : "default"} className="capitalize">{cliente.tipo}</Badge>
          <Badge variant={cliente.estado === "activo" ? "success" : "default"} className="capitalize">{cliente.estado}</Badge>
          <WhatsappButton telefono={cliente.telefono} />
          <NuevoClienteDialog cliente={cliente} />
          <EliminarClienteDialog clienteId={cliente.id} nombre={`${cliente.nombre} ${cliente.apellido ?? ""}`} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <MiniStat label="AUM" value={formatUSD(aumTotal)} />
        <MiniStat label="AUM Local" value={formatUSD(aumLocal)} />
        <MiniStat label="AUM Offshore" value={formatUSD(aumOffshore)} />
        <MiniStat label="Potencial" value={formatUSD(cliente.potencial_usd ?? 0)} />
        <MiniStat label="Cuentas" value={String((cuentas ?? []).length)} />
      </div>

      <Tabs defaultValue="perfil">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="cuentas">Cuentas</TabsTrigger>
          <TabsTrigger value="kyc">KYC</TabsTrigger>
          <TabsTrigger value="interacciones">Interacciones</TabsTrigger>
          <TabsTrigger value="patrimonio">Patrimonio</TabsTrigger>
          <TabsTrigger value="tareas">Tareas</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
          <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="space-y-4">
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 p-5 text-sm">
              <Field label="Razón social" value={cliente.razon_social} />
              <Field label="Documento" value={cliente.documento} />
              <Field label="Fecha de nacimiento" value={cliente.fecha_nacimiento} />
              <Field label="Último contacto" value={cliente.fecha_ultimo_contacto} />
              <Field label="Referenciado por" value={cliente.referenciado_por} />
              <div className="col-span-2">
                <Field label="Notas" value={cliente.notas} />
              </div>
            </CardContent>
          </Card>
          <HogarWidget
            clienteId={cliente.id}
            hogarActualId={cliente.hogar_id}
            hogarNombre={hogarInfo?.nombre ?? null}
            hogaresDisponibles={hogaresDisponibles ?? []}
            miembros={miembrosHogar}
          />
        </TabsContent>

        <TabsContent value="cuentas">
          <div className="space-y-3">
            <div className="flex justify-end">
              <AgregarCuentaDialog clienteId={cliente.id} />
            </div>
            <Table>
              <THead><TR><TH>Comitente</TH><TH>Tipo</TH><TH>Plaza</TH><TH>Estado</TH><TH>Saldo</TH><TH>Comisión mes pasado</TH><TH>Cotitular</TH><TH></TH></TR></THead>
              <TBody>
                {(cuentas ?? []).map((cu: any) => {
                  const cotitular = (otrosTitulares ?? []).find((t: any) => t.cuenta_id === cu.id);
                  return (
                    <TR key={cu.id}>
                      <TD className="tabular">{cu.numero_cuenta}</TD>
                      <TD>{cu.tipo_cuenta ?? "—"}</TD>
                      <TD>{PLAZAS.find((p) => p.key === cu.plaza)?.label ?? cu.plaza}</TD>
                      <TD><Badge variant={cu.estado_cuenta === "activa" ? "success" : "default"}>{cu.estado_cuenta}</Badge></TD>
                      <TD className="tabular">{formatUSD(aumPorCuentaIndividual.get(cu.numero_cuenta) ?? 0)}</TD>
                      <TD className="tabular">{formatUSD(comisionPorCuenta.get(cu.numero_cuenta) ?? 0)}</TD>
                      <TD>
                        {cotitular ? (
                          <Link href={`/clientes/${cotitular.clientes.id}`} className="text-accent hover:underline">
                            {cotitular.clientes.nombre} {cotitular.clientes.apellido}
                          </Link>
                        ) : "—"}
                      </TD>
                      <TD>
                        <div className="flex">
                          <ActualizarSaldoDialog numeroCuenta={cu.numero_cuenta} aumActual={aumPorCuentaIndividual.get(cu.numero_cuenta) ?? 0} />
                          <EditarCuentaDialog cuenta={cu} />
                        </div>
                      </TD>
                    </TR>
                  );
                })}
                {(cuentas ?? []).length === 0 && <TR><TD colSpan={8} className="text-center text-muted-foreground py-6">Sin cuentas registradas.</TD></TR>}
              </TBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="kyc">
          <Table>
            <THead><TR><TH>Cuenta</TH><TH>Perfil</TH><TH>Experiencia</TH><TH>Origen de fondos</TH><TH>Patrimonio est.</TH></TR></THead>
            <TBody>
              {(kycRows ?? []).map((k: any) => (
                <TR key={k.id}>
                  <TD className="tabular">{k.cuentas?.numero_cuenta}</TD>
                  <TD>{k.perfil_inversor ?? "—"}</TD>
                  <TD>{k.experiencia_inversiones ?? "—"}</TD>
                  <TD>{k.origen_fondos ?? "—"}</TD>
                  <TD className="tabular">{k.patrimonio_estimado ? formatUSD(k.patrimonio_estimado) : "—"}</TD>
                </TR>
              ))}
              {(kycRows ?? []).length === 0 && <TR><TD colSpan={5} className="text-center text-muted-foreground py-6">Sin KYC cargado.</TD></TR>}
            </TBody>
          </Table>
        </TabsContent>

        <TabsContent value="interacciones">
          <div className="space-y-3">
            {(interacciones ?? []).map((i) => (
              <Card key={i.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="accent" className="capitalize">{i.tipo}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(i.fecha).toLocaleDateString("es-AR")}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium">{i.asunto}</p>
                  <p className="text-sm text-muted-foreground">{i.detalle}</p>
                  {i.proxima_accion && (
                    <p className="mt-2 text-xs text-accent">Próxima acción: {i.proxima_accion} ({i.fecha_proxima_accion})</p>
                  )}
                </CardContent>
              </Card>
            ))}
            {(interacciones ?? []).length === 0 && <p className="text-center text-muted-foreground py-6">Sin interacciones registradas.</p>}
          </div>
        </TabsContent>

        <TabsContent value="patrimonio">
          <Table>
            <THead><TR><TH>Fecha</TH><TH>Cuenta</TH><TH>AUM</TH><TH>Cash</TH></TR></THead>
            <TBody>
              {(patrimonio ?? []).map((p) => (
                <TR key={p.id}>
                  <TD>{p.fecha_carga}</TD>
                  <TD className="tabular">{p.numero_cuenta}</TD>
                  <TD className="tabular">{formatNumberAR(p.aum)}</TD>
                  <TD className="tabular">{formatNumberAR(p.cash)}</TD>
                </TR>
              ))}
              {(patrimonio ?? []).length === 0 && <TR><TD colSpan={4} className="text-center text-muted-foreground py-6">Sin patrimonio cargado.</TD></TR>}
            </TBody>
          </Table>
        </TabsContent>

        <TabsContent value="tareas">
          <Table>
            <THead><TR><TH>Título</TH><TH>Prioridad</TH><TH>Vencimiento</TH><TH>Estado</TH></TR></THead>
            <TBody>
              {(tareas ?? []).map((t) => (
                <TR key={t.id}>
                  <TD>{t.titulo}</TD>
                  <TD><Badge variant={t.prioridad === "alta" ? "danger" : t.prioridad === "media" ? "warning" : "default"} className="capitalize">{t.prioridad}</Badge></TD>
                  <TD>{t.fecha_vencimiento ?? "—"}</TD>
                  <TD className="capitalize">{t.estado.replace("_", " ")}</TD>
                </TR>
              ))}
              {(tareas ?? []).length === 0 && <TR><TD colSpan={4} className="text-center text-muted-foreground py-6">Sin tareas asociadas.</TD></TR>}
            </TBody>
          </Table>
        </TabsContent>

        <TabsContent value="documentos">
          <DocumentosCliente clienteId={cliente.id} />
        </TabsContent>

        <TabsContent value="historial">
          <Table>
            <THead><TR><TH>Fecha</TH><TH>Campo</TH><TH>Antes</TH><TH>Después</TH><TH>Usuario</TH></TR></THead>
            <TBody>
              {(historial ?? []).map((h: any) => (
                <TR key={h.id}>
                  <TD>{new Date(h.fecha).toLocaleString("es-AR")}</TD>
                  <TD className="capitalize">{h.campo}</TD>
                  <TD className="capitalize">{h.valor_anterior ?? "—"}</TD>
                  <TD className="capitalize">{h.valor_nuevo ?? "—"}</TD>
                  <TD>{h.usuarios ? `${h.usuarios.nombre} ${h.usuarios.apellido}` : "—"}</TD>
                </TR>
              ))}
              {(historial ?? []).length === 0 && <TR><TD colSpan={5} className="text-center text-muted-foreground py-6">Sin cambios de tipo o estado registrados todavía.</TD></TR>}
            </TBody>
          </Table>
        </TabsContent>

        <TabsContent value="oportunidades">
          <Card>
            <CardHeader><CardTitle>Alertas para este cliente</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              El motor de oportunidades general está en /oportunidades. Acá vas a ver, en la próxima fase, las alertas específicas de este cliente (cash elevado, vencimientos, sin contacto).
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-lg font-semibold tabular capitalize">{value}</p>
      </CardContent>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5">{value || "—"}</p>
    </div>
  );
}
