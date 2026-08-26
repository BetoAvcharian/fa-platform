let totalCuentas = 0;
let primerError: string | null = null;

for (const c of cuentasParaInsertar) {
  const nuevoId = crypto.randomUUID();
  const { error: errorCuenta } = await supabase
    .from("cuentas")
    .insert({ id: nuevoId, numero_cuenta: c.numero_cuenta, estado_cuenta: "activa", plaza: "local" });

  if (errorCuenta) {
    if (errorCuenta.code === "23505") {
      const { data: existente } = await supabase
        .from("cuentas").select("id").eq("numero_cuenta", c.numero_cuenta).maybeSingle();
      if (existente) {
        const { error: et } = await supabase
          .from("cuenta_titulares")
          .insert({ cuenta_id: existente.id, cliente_id: c.clienteIdTemp, rol_titular: "cotitular" });
        if (!et) totalCuentas++;
      }
    } else {
      if (!primerError) primerError = errorCuenta.message;
    }
    continue;
  }

  const { error: errorTitular } = await supabase
    .from("cuenta_titulares")
    .insert({ cuenta_id: nuevoId, cliente_id: c.clienteIdTemp, rol_titular: "titular" });
  if (!errorTitular) totalCuentas++;
  else if (!primerError) primerError = errorTitular.message;
}

if (primerError) {
  toast.warning(`Algunos comitentes no se vincularon — error: ${primerError}`);
}
