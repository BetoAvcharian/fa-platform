"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  CheckSquare,
  BarChart3,
  Upload,
  Bell,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { href: "/tareas", label: "Tareas", icon: CheckSquare },
  { href: "/oportunidades", label: "Oportunidades", icon: Bell },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/importador", label: "Importador", icon: Upload },
];

export function Sidebar({ nombre, rol }: { nombre: string; rol: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-white/10 bg-sidebar text-sidebar-foreground transition-all",
        collapsed ? "w-[68px]" : "w-60"
      )}
    >
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground text-sm font-semibold">
          FA
        </div>
        {!collapsed && <span className="text-sm font-semibold">FA Platform</span>}
      </div>

      <nav className="flex-1 space-y-0.5 px-2">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-white/10 text-white font-medium"
                  : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-white/5 hover:text-white"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {!collapsed && <span>{theme === "dark" ? "Modo claro" : "Modo oscuro"}</span>}
        </button>

        {!collapsed && (
          <div className="px-3 py-2 text-xs text-sidebar-foreground/50">
            <p className="font-medium text-sidebar-foreground/80">{nombre}</p>
            <p className="capitalize">{rol}</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-white/5 hover:text-white"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          {!collapsed && <span>Colapsar</span>}
        </button>
      </div>
    </aside>
  );
}
