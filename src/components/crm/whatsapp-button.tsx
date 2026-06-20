import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function WhatsappButton({ telefono }: { telefono: string | null }) {
  if (!telefono) return null;
  const numero = telefono.replace(/[^\d]/g, "");
  return (
    <a href={`https://wa.me/${numero}`} target="_blank" rel="noopener noreferrer">
      <Button size="sm" variant="outline">
        <MessageCircle className="h-4 w-4" /> WhatsApp
      </Button>
    </a>
  );
}
