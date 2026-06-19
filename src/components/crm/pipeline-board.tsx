"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatUSD, diasDesde } from "@/lib/utils";
import { PIPELINE_ETAPAS, type Cliente, type PipelineEtapa } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

type ClienteRow = Cliente & { owner_nombre?: string };

export function PipelineBoard({ clientes }: { clientes: ClienteRow[] }) {
  const [items, setItems] = useState(clientes);
  const supabase = createClient();

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const nuevaEtapa = result.destination.droppableId as PipelineEtapa;
    const clienteId = result.draggableId;

    setItems((prev) =>
      prev.map((c) => (c.id === clienteId ? { ...c, pipeline_etapa: nuevaEtapa } : c))
    );

    await supabase.from("clientes").update({ pipeline_etapa: nuevaEtapa }).eq("id", clienteId);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {PIPELINE_ETAPAS.map((etapa) => {
          const clientesEtapa = items.filter((c) => c.pipeline_etapa === etapa.key);
          const valorTotal = clientesEtapa.reduce((sum, c) => sum + Number(c.potencial_usd ?? 0), 0);

          return (
            <Droppable droppableId={etapa.key} key={etapa.key}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex w-72 shrink-0 flex-col rounded-lg border border-border bg-muted/40 ${
                    snapshot.isDraggingOver ? "ring-2 ring-accent" : ""
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
                    <span className="text-sm font-medium">{etapa.label}</span>
                    <Badge variant="default">{clientesEtapa.length}</Badge>
                  </div>
                  <p className="px-3 py-1.5 text-xs text-muted-foreground tabular">{formatUSD(valorTotal)}</p>

                  <div className="flex-1 space-y-2 p-2">
                    {clientesEtapa.map((c, index) => (
                      <Draggable draggableId={c.id} index={index} key={c.id}>
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            style={dragProvided.draggableProps.style as React.CSSProperties}
                            className={`rounded-md border border-border bg-card p-3 shadow-sm transition-shadow ${
                              dragSnapshot.isDragging ? "shadow-lg" : ""
                            }`}
                          >
                            <Link href={`/clientes/${c.id}`} className="text-sm font-medium hover:text-accent">
                              {c.nombre} {c.apellido}
                            </Link>
                            <p className="mt-1 text-xs tabular text-muted-foreground">{formatUSD(c.potencial_usd ?? 0)}</p>
                            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                              <span>{c.owner_nombre ?? ""}</span>
                              <span>{diasDesde(c.fecha_ultimo_contacto) ?? "—"}d</span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
}
