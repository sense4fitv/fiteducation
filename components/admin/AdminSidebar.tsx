"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Trainers", href: "/admin/trainers", icon: Users },
  { label: "Enrollments", href: "/admin/enrollments", icon: GraduationCap },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <aside className="w-64 min-h-screen bg-[#0A0A0A] border-r border-card-border flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-6 py-6">
        <h1 className="text-lg font-semibold text-white tracking-tight">
          Fit<span className="text-accent-primary">Education</span>
        </h1>
        <p className="text-xs text-text-secondary-dark mt-0.5">Admin Panel</p>
      </div>

      <Separator className="bg-card-border" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Button
              key={href}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium ${
                isActive
                  ? "bg-accent-primary text-white hover:bg-accent-primary/90"
                  : "text-text-secondary-dark hover:text-white hover:bg-card-dark"
              }`}
              render={<Link href={href} />}
            >
              <Icon size={18} />
              {label}
            </Button>
          );
        })}
      </nav>

      <Separator className="bg-card-border" />

      {/* Logout */}
      <div className="px-3 py-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium text-text-secondary-dark hover:text-white hover:bg-card-dark"
        >
          <LogOut size={18} />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
