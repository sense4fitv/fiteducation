"use client";

import { usePathname } from "next/navigation";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Cursuri & Workshops",
  "/admin/trainers": "Traineri",
  "/admin/enrollments": "Înscrieri",
};

function titleFor(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  const match = Object.keys(TITLES).find(
    (key) => key !== "/admin" && pathname.startsWith(key + "/")
  );
  return match ? TITLES[match] : "Admin";
}

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = titleFor(pathname);

  return (
    <SidebarProvider>
      <AdminSidebar email={email} />
      <SidebarInset className="bg-section-dark text-zinc-100">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-zinc-800 bg-section-dark/95 px-4 backdrop-blur">
          <SidebarTrigger className="text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100" />
          <div className="h-5 w-px bg-zinc-800" />
          <h1 className="text-sm font-medium text-zinc-200">{title}</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
