"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers3, LayoutDashboard, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/users", icon: Users },
  { label: "Segments", href: "/segments", icon: Layers3 },
];

interface SidebarProps {
  onClose?: () => void; 
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col bg-slate-950">
      <div className="flex flex-col p-4">
        <div className="px-2">
          <h2 className="text-2xl font-semibold tracking-tight text-white">SmartCRM</h2>
        </div>

        <nav className="mt-10 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Button
                key={item.label}
                asChild
                variant="ghost"
                // ... classes wesi hi rahen gi
                className={`h-11 w-full justify-start gap-3 rounded-lg px-3.5 text-sm font-semibold transition-colors ${
                  isActive ? "bg-slate-800 text-white" : "text-slate-300"
                }`}
              >
                {/* Yahan onClick add kiya */}
                <Link 
                  href={item.href} 
                  onClick={onClose} 
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-2.5">
          <span className="px-1 text-xs font-medium tracking-wide text-slate-400">
            Appearance
          </span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
