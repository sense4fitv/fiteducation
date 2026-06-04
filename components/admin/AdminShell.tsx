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
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
          <SidebarTrigger />
          <div className="h-5 w-px bg-border" />
          <h1 className="text-sm font-medium">{title}</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
