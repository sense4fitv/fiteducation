"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOff, Pencil } from "lucide-react";

import { deleteShopProduct } from "@/app/admin/shop/_actions";
import { RowDeleteButton } from "@/components/admin/RowDeleteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/format";
import { DELIVERY_LABEL, type DeliveryOption } from "@/lib/shop";
import type { Enums } from "@/lib/supabase/types";

export type ShopRow = {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: Enums<"currency_code">;
  status: Enums<"course_status">;
  delivery_options: DeliveryOption[];
  variants_count: number;
  colors: { name: string; hex: string | null }[];
  stock: number | null;
  cover_url: string | null;
};

const STATUS_LABEL: Record<Enums<"course_status">, string> = {
  draft: "Draft",
  published: "Publicat",
  archived: "Arhivat",
};

function stockLabel(row: ShopRow) {
  if (row.variants_count > 0) return `${row.variants_count} variante`;
  return row.stock == null ? "—" : `${row.stock} buc.`;
}

export function ShopProductsList({ items }: { items: ShopRow[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
        Niciun produs în magazin.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16" />
            <TableHead>Produs</TableHead>
            <TableHead className="w-28">Status</TableHead>
            <TableHead className="w-28 text-right">Preț</TableHead>
            <TableHead className="w-32 text-right">Stoc</TableHead>
            <TableHead className="w-64">Livrare</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div className="relative size-10 overflow-hidden rounded-md border border-border bg-muted/40">
                  {p.cover_url ? (
                    <Image
                      src={p.cover_url}
                      alt=""
                      fill
                      unoptimized
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : (
                    <ImageOff className="absolute inset-0 m-auto size-4 text-muted-foreground" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Link
                  href={`/admin/shop/${p.id}`}
                  className="font-medium hover:underline"
                >
                  {p.name}
                </Link>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{p.slug}</p>
                  {p.colors.length > 0 ? (
                    <span className="flex items-center gap-1">
                      {p.colors.map((color) => (
                        <span
                          key={color.name}
                          title={color.name}
                          className="size-3 rounded-full border border-border"
                          style={{
                            backgroundColor: color.hex ?? "transparent",
                          }}
                        />
                      ))}
                    </span>
                  ) : null}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={p.status === "published" ? "default" : "outline"}
                >
                  {STATUS_LABEL[p.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatPrice(p.price, p.currency)}
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {stockLabel(p)}
              </TableCell>
              <TableCell>
                {p.delivery_options.length === 0 ? (
                  <span className="text-xs text-muted-foreground">
                    Nicio metodă
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {p.delivery_options.map((option) => (
                      <Badge key={option} variant="outline">
                        {DELIVERY_LABEL[option]}
                      </Badge>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    render={
                      <Link
                        href={`/admin/shop/${p.id}`}
                        aria-label="Editează"
                      />
                    }
                  >
                    <Pencil />
                  </Button>
                  <RowDeleteButton
                    onDelete={() => deleteShopProduct(p.id)}
                    confirmMessage={`Ștergi produsul „${p.name}"? Imaginile și variantele vor fi șterse.`}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
