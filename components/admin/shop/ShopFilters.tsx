"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ShopFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const status = params?.get("status") ?? "all";

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params?.toString() ?? "");
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.push(qs ? `/admin/shop?${qs}` : "/admin/shop");
  }

  return (
    <div className="flex items-center gap-3">
      <Select value={status} onValueChange={(v) => setParam("status", v)}>
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toate statusurile</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="published">Publicat</SelectItem>
          <SelectItem value="archived">Arhivat</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
