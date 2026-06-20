"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton({ label = "Volver" }: { label?: string }) {
  const router = useRouter();
  return (
    <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-1 -ml-2">
      <ArrowLeft className="h-4 w-4" /> {label}
    </Button>
  );
}
