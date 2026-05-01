"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers3, LayoutDashboard, Users } from "lucide-react";
// 1. Import Clerk components
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

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
        {/* Logo Section */}
        <div className="px-2">
          <h2 className="text-2xl font-semibold tracking-tight text-white">SmartCRM</h2>
        </div>

        {/* Navigation */}
        <nav className="mt-10 flex flex-col gap-2">
          {navItems.map((item) => (
            <Button
              key={item.label}
              asChild
              variant="ghost"
              className={`h-11 w-full justify-start gap-3 rounded-lg px-3.5 text-sm font-semibold transition-colors ${
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Link href={item.href} onClick={onClose}>
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      <div className="mt-auto space-y-2 p-4">
        {/* MOBILE ONLY: Sign In / Sign Up Section */}
        <div className="md:hidden">
          <Show when="signed-out">
            <div className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
              <SignInButton mode="modal">
                <Button className="w-full bg-slate-800 text-white hover:bg-slate-700">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="w-full bg-purple-700 text-white hover:bg-purple-600">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </Show>
        </div>

        {/* User Account (Logged In) */}
        <Show when="signed-in">
          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-2.5">
            <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-white">Account</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Manage Profile</span>
            </div>
          </div>
        </Show>

        {/* Appearance Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-2.5">
          <span className="px-1 text-xs font-medium tracking-wide text-slate-400">Appearance</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
