import { ImportadorPatrimonio } from "@/components/crm/importador-patrimonio";

export default function ImportadorPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Importador de patrimonio</h1>
        <p className="text-sm text-muted-foreground">
          El importador de movimientos (Fecha / NumeroCuenta / Tipo / Monto) sigue la misma lógica y se agrega en la próxima fase.
        </p>
      </div>
      <ImportadorPatrimonio />
    </div>
  );
}
