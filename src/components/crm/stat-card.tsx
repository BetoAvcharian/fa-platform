import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  hint,
  href,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger";
  hint?: string;
  href?: string;
}) {
  const toneClasses = {
    default: "bg-accent/15 text-accent",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    danger: "bg-danger/15 text-danger",
  };

  const content = (
    <CardContent className="flex items-start justify-between p-5">
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1.5 text-2xl font-semibold tabular">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-md", toneClasses[tone])}>
        <Icon className="h-[18px] w-[18px]" />
      </div>
    </CardContent>
  );

  if (href) {
    return (
      <Link href={href} className="block transition-opacity hover:opacity-80">
        <Card>{content}</Card>
      </Link>
    );
  }

  return <Card>{content}</Card>;
}
