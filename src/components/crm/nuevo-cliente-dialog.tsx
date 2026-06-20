"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectNative } from "@/components/ui/select-native";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const initialState = {
  // datos básicos
  tipo: "prospecto",
  nombre: "",
  apellido: "",
  tipo_persona: "fisica",
  razon_social: "",
  documento: "",
  cuit_cuil: "",
  email: "",
  telefono: "",
  email_alternativo: "",
  telefono_alternativo: "",
  fecha_nacimiento: "",
  nacionalidad: "",
  estado_civil: "",
  profesion: "",
  potencial_usd: "",
  notas: "",
  // domicilio
  domicilio_calle: "",
  domicilio_numero: "",
  domicilio_piso: "",
  domicilio_ciudad: "",
  domicilio_provincia: "",
  domicilio_pais: "Argentina",
  domicilio_cp: "",
  // financiero / compliance
  pep: false,
  ingresos_anuales_usd: "",
  actividad_declarada: "",
  banco_referencia: "",
};

export function NuevoClienteDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialState);
  const [guardando, setGuardando] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre) {
      toast.error("El nombre es obligatorio");
      return;
    }
    setGuardando(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("clientes").insert({
      owner_id: user?.id,
      tipo: form.tipo,
      nombre: form.nombre,
      apellido: form.apellido || null,
      tipo_persona: form.tipo_persona,
      razon_social: form.razon_social || null,
      documento: form.documento || null,
      cuit_cuil: form.cuit_cuil || null,
      email: form.email || null,
      telefono: form.telefono || null,
      email_alternativo: form.email_alternativo || null,
      telefono_alternativo: form.telefono_alternativo || null,
      fecha_nacimiento: form.fecha_nacimiento || null,
      nacionalidad: form.nacionalidad || null,
      estado_civil: form.estado_civil || null,
      profesion: form.profesion || null,
      potencial_usd: form.potencial_usd ? Number(form.potencial_usd) : 0,
      notas: form.notas || null,
      domicilio_calle: form.domicilio_calle || null,
      domicilio_numero: form.domicilio_numero || null,
      domicilio_piso: form.domicilio_piso || null,
      domicilio_ciudad: form.domicilio_ciudad || null,
      domicilio_provincia: form.domicilio_provincia || null,
      domicilio_pais: form.domicilio_pais || null,
      domicilio_cp: form.domicilio_cp || null,
      pep: form.pep,
      ingresos_anuales_usd: form.ingresos_anuales_usd ? Number(form.ingresos_anuales_usd) : null,
      actividad_declarada: form.actividad_declarada || null,
      banco_referencia: form.banco_referencia || null,
      estado: "activo",
    });

    setGuardando(false);

    if (error) {
      toast.error("Error al crear cliente: " + error.message);
      return;
    }

    toast.success("Cliente creado");
    setForm(initialState);
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" /> Nuevo cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nuevo cliente / prospecto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="basico">
            <TabsList>
              <TabsTrigger value="basico">Básico</TabsTrigger>
              <TabsTrigger value="domicilio">Domicilio</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            <TabsContent value="basico" className="grid grid-cols-2 gap-3">
              <Field label="Tipo">
                <SelectNative value={form.tipo} onChange={(e) => update("tipo", e.target.value)}>
                  <option value="prospecto">Prospecto</option>
                  <option value="cliente">Cliente</option>
                </SelectNative>
              </Field>
              <Field label="Tipo de persona">
                <SelectNative value={form.tipo_persona} onChange={(e) => update("tipo_persona", e.target.value)}>
                  <option value="fisica">Física</option>
                  <option value="juridica">Jurídica</option>
                </SelectNative>
              </Field>
              <Field label="Nombre *">
                <Input required value={form.nombre} onChange={(e) => update("nombre", e.target.value)} />
              </Field>
              <Field label="Apellido">
                <Input value={form.apellido} onChange={(e) => update("apellido", e.target.value)} />
              </Field>
              <Field label="Razón social (si es jurídica)">
                <Input value={form.razon_social} onChange={(e) => update("razon_social", e.target.value)} />
              </Field>
              <Field label="Documento (DNI)">
                <Input value={form.documento} onChange={(e) => update("documento", e.target.value)} />
              </Field>
              <Field label="CUIT/CUIL">
                <Input value={form.cuit_cuil} onChange={(e) => update("cuit_cuil", e.target.value)} />
              </Field>
              <Field label="Fecha de nacimiento">
                <Input type="date" value={form.fecha_nacimiento} onChange={(e) => update("fecha_nacimiento", e.target.value)} />
              </Field>
              <Field label="Email">
                <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
              </Field>
              <Field label="Email alternativo">
                <Input type="email" value={form.email_alternativo} onChange={(e) => update("email_alternativo", e.target.value)} />
              </Field>
              <Field label="Teléfono">
                <Input value={form.telefono} onChange={(e) => update("telefono", e.target.value)} />
              </Field>
              <Field label="Teléfono alternativo">
                <Input value={form.telefono_alternativo} onChange={(e) => update("telefono_alternativo", e.target.value)} />
              </Field>
              <Field label="Nacionalidad">
                <Input value={form.nacionalidad} onChange={(e) => update("nacionalidad", e.target.value)} />
              </Field>
              <Field label="Estado civil">
                <Input value={form.estado_civil} onChange={(e) => update("estado_civil", e.target.value)} />
              </Field>
              <Field label="Profesión">
                <Input value={form.profesion} onChange={(e) => update("profesion", e.target.value)} />
              </Field>
              <Field label="Potencial USD">
                <Input type="number" value={form.potencial_usd} onChange={(e) => update("potencial_usd", e.target.value)} />
              </Field>
              <div className="col-span-2">
                <Field label="Notas">
                  <Textarea rows={3} value={form.notas} onChange={(e) => update("notas", e.target.value)} />
                </Field>
              </div>
            </TabsContent>

            <TabsContent value="domicilio" className="grid grid-cols-2 gap-3">
              <Field label="Calle"><Input value={form.domicilio_calle} onChange={(e) => update("domicilio_calle", e.target.value)} /></Field>
              <Field label="Número"><Input value={form.domicilio_numero} onChange={(e) => update("domicilio_numero", e.target.value)} /></Field>
              <Field label="Piso/Depto"><Input value={form.domicilio_piso} onChange={(e) => update("domicilio_piso", e.target.value)} /></Field>
              <Field label="Código postal"><Input value={form.domicilio_cp} onChange={(e) => update("domicilio_cp", e.target.value)} /></Field>
              <Field label="Ciudad"><Input value={form.domicilio_ciudad} onChange={(e) => update("domicilio_ciudad", e.target.value)} /></Field>
              <Field label="Provincia"><Input value={form.domicilio_provincia} onChange={(e) => update("domicilio_provincia", e.target.value)} /></Field>
              <Field label="País"><Input value={form.domicilio_pais} onChange={(e) => update("domicilio_pais", e.target.value)} /></Field>
            </TabsContent>

            <TabsContent value="compliance" className="grid grid-cols-2 gap-3">
              <Field label="¿Persona expuesta políticamente (PEP)?">
                <SelectNative value={form.pep ? "si" : "no"} onChange={(e) => update("pep", e.target.value === "si")}>
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                </SelectNative>
              </Field>
              <Field label="Ingresos anuales (USD)">
                <Input type="number" value={form.ingresos_anuales_usd} onChange={(e) => update("ingresos_anuales_usd", e.target.value)} />
              </Field>
              <Field label="Actividad declarada">
                <Input value={form.actividad_declarada} onChange={(e) => update("actividad_declarada", e.target.value)} />
              </Field>
              <Field label="Banco de referencia">
                <Input value={form.banco_referencia} onChange={(e) => update("banco_referencia", e.target.value)} />
              </Field>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={guardando}>{guardando ? "Guardando..." : "Crear cliente"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
