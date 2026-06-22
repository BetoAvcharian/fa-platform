"use client";
import { Logo } from "@/components/ui/logo";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  UserX,
  Gavel,
  CheckSquare,
  BarChart3,
  Upload,
  Bell,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  UserCog,
  NotebookPen,
  Receipt,
} from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  [
    { href: "/clientes", label: "Clientes", icon: Users },
    { href: "/prospectos", label: "Prospectos", icon: UserPlus },
    { href: "/ex-clientes", label: "Ex Clientes", icon: UserX },
  ],
  [
    { href: "/licitaciones", label: "Licitaciones", icon: Gavel },
    { href: "/tareas", label: "Tareas", icon: CheckSquare },
  ],
  [
    { href: "/resumen-dia", label: "Resumen del día", icon: NotebookPen },
    { href: "/oportunidades", label: "Oportunidades", icon: Bell },
  ],
  [
    { href: "/comisiones", label: "Comisiones", icon: Receipt },
    { href: "/reportes", label: "Reportes", icon: BarChart3 },
  ],
];

const NAV_FINAL = [{ href: "/importador", label: "Importador", icon: Upload }];
const NAV_ADMIN = { href: "/usuarios", label: "Usuarios", icon: UserCog };

export function Sidebar({ nombre, rol }: { nombre: string; rol: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <>
      {/* barra superior solo en mobile */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 md:hidden">
        <button onClick={() => setMobileOpen(true)} className="text-foreground">
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-foreground text-xs font-semibold">
            <Logo className="h-4 w-4 text-accent-foreground" />
        </div>
        <span className="text-sm font-semibold">TIT CRM</span>
      </div>

      {/* fondo oscuro al abrir el menú en mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-white/10 bg-sidebar text-sidebar-foreground transition-transform duration-200 md:static md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-60 md:w-[68px]" : "w-60"
        )}
      >
        <div className="flex items-center justify-between gap-2 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground text-sm font-semibold">
            <Logo className="h-4.5 w-4.5 text-accent-foreground" />
            </div>
            {!collapsed && <span className="text-sm font-semibold">TIT CRM</span>}
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-sidebar-foreground/70 md:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-3 px-2 overflow-y-auto py-1">
          {[...NAV_GROUPS, [...NAV_FINAL, ...(rol === "admin" ? [NAV_ADMIN] : [])]].map((grupo, gi) => (
            <div key={gi} className="space-y-0.5">
              {grupo.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
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
            </div>
          ))}
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
            className="hidden w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-white/5 hover:text-white md:flex"
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            {!collapsed && <span>Colapsar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
