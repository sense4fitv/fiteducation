"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  Users,
} from "lucide-react";

import { signOutAdmin } from "@/app/admin/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Cursuri & Workshops", icon: Package },
  { href: "/admin/trainers", label: "Traineri", icon: Users },
  { href: "/admin/enrollments", label: "Înscrieri", icon: ClipboardList },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

function initials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-zinc-800 bg-zinc-950">
      <SidebarHeader className="border-b border-zinc-800 py-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex size-9 items-center justify-center rounded-md bg-accent-primary text-sm font-bold text-white">
            FE
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-zinc-100">
              FitEducation
            </span>
            <span className="text-xs text-zinc-500">Admin</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={active}
                      tooltip={item.label}
                      className={
                        active
                          ? "bg-accent-primary/15 text-zinc-100 hover:bg-accent-primary/20 data-[active=true]:bg-accent-primary/15 data-[active=true]:text-zinc-100"
                          : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                      }
                    >
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-800">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-900"
              />
            }
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-accent-primary text-xs text-white">
                {initials(email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
              <span className="truncate text-xs text-zinc-500">
                Conectat ca
              </span>
              <span className="truncate text-sm text-zinc-200">{email}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="end"
            className="w-56 border-zinc-800 bg-zinc-900 text-zinc-100"
          >
            <form action={signOutAdmin}>
              <DropdownMenuItem
                render={<button type="submit" />}
                className="w-full cursor-pointer text-zinc-200 focus:bg-zinc-800 focus:text-zinc-100"
              >
                <LogOut className="size-4" />
                Deconectare
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
