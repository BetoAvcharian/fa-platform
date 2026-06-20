import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { formatUSD, formatNumberAR } from "@/lib/utils";
import { DocumentosCliente } from "@/components/crm/documentos-cliente";
import { NuevoClienteDialog } from "@/components/crm/nuevo-cliente-dialog";
import { BackButton } from "@/components/ui/back-button";

export default async function ClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: cliente } = await supabase.from("clientes").select("*").eq("id", id).single();
  if (!cliente) notFound();

  const { data: cuentas } = await supabase.from("cuentas").select("*").eq("cliente_id", id);
  const numerosCuenta = (cuentas ?? []).map((c) => c.numero_cuenta);

  const { data: kycRows } = await supabase
    .from("kyc")
    .select("*, cuentas:cuenta_id(numero_cuenta)")
    .in("cuenta_id", (cuentas ?? []).map((c) => c.id));

  const { data: interacciones } = await supabase
    .from("interacciones")
    .select("*")
    .eq("cliente_id", id)
    .order("fecha", { ascending: false });

  const { data: tareas } = await supabase
    .from("tareas")
    .select("*")
    .eq("cliente_id", id)
    .order("fecha_vencimiento", { ascending: true });

  const { data: patrimonio } = numerosCuenta.length
    ? await supabase
        .from("patrimonio")
        .select("*")
        .in("numero_cuenta", numerosCuenta)
        .order("fecha_carga", { ascending: false })
    : { data: [] as any[] };

  const aumTotal = (patrimonio ?? [])
    .filter((p, i, arr) => arr.findIndex((x) => x.numero_cuenta === p.numero_cuenta) === i)
    .reduce((sum, p) => sum + Number(p.aum), 0);

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
          <NuevoClienteDialog cliente={cliente} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MiniStat label="AUM" value={formatUSD(aumTotal)} />
        <MiniStat label="Potencial" value={formatUSD(cliente.potencial_usd ?? 0)} />
        <MiniStat label="Cuentas" value={String((cuentas ?? []).length)} />
        <MiniStat label="Etapa pipeline" value={cliente.pipeline_etapa.replace("_", " ")} />
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
          <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil">
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
        </TabsContent>

        <TabsContent value="cuentas">
          <Table>
            <THead><TR><TH>Comitente</TH><TH>Tipo</TH><TH>Estado</TH></TR></THead>
            <TBody>
              {(cuentas ?? []).map((c) => (
                <TR key={c.id}>
                  <TD className="tabular">{c.numero_cuenta}</TD>
                  <TD>{c.tipo_cuenta ?? "—"}</TD>
                  <TD><Badge variant={c.estado_cuenta === "activa" ? "success" : "default"}>{c.estado_cuenta}</Badge></TD>
                </TR>
              ))}
              {(cuentas ?? []).length === 0 && <TR><TD colSpan={3} className="text-center text-muted-foreground py-6">Sin cuentas registradas.</TD></TR>}
            </TBody>
          </Table>
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
