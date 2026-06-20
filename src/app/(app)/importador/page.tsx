import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ImportadorPatrimonio } from "@/components/crm/importador-patrimonio";
import { ImportadorComisiones } from "@/components/crm/importador-comisiones";
import { ImportadorClientes } from "@/components/crm/importador-clientes";

export default function ImportadorPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Importador</h1>
        <p className="text-sm text-muted-foreground">Clientes, patrimonio y comisiones — el de movimientos se agrega en la próxima fase.</p>
      </div>
      <Tabs defaultValue="clientes">
        <TabsList>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="patrimonio">Patrimonio</TabsTrigger>
          <TabsTrigger value="comisiones">Comisiones</TabsTrigger>
        </TabsList>
        <TabsContent value="clientes"><ImportadorClientes /></TabsContent>
        <TabsContent value="patrimonio"><ImportadorPatrimonio /></TabsContent>
        <TabsContent value="comisiones"><ImportadorComisiones /></TabsContent>
      </Tabs>
    </div>
  );
}
