"use client";

import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ExportExcelButton({ data, filename, sheetName = "Datos" }: { data: Record<string, any>[]; filename: string; sheetName?: string }) {
  function exportar() {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, filename);
  }
  return (
    <Button variant="ghost" size="sm" onClick={exportar} disabled={data.length === 0}>
      <Download className="h-3.5 w-3.5" />
    </Button>
  );
}
