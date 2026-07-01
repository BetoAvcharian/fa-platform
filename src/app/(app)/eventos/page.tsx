import { createClient } from "@/lib/supabase/server";
import { EventosView } from "@/components/crm/eventos-view";

export default async function EventosPage() {
  const supabase = await createClient();
  const { data: eventos } = await supabase
    .from("eventos")
    .select("*")
    .order("fecha", { ascending: true });
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Eventos</h1>
        <p className="text-sm text-muted-foreground">Conferencias, networking, cenas — todo lo que tenés que concurrir</p>
      </div>
      <EventosView eventos={eventos ?? []} />
    </div>
  );
}
