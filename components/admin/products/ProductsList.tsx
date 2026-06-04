"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { deleteCourse } from "@/app/admin/products/_actions";
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
import { formatDate, formatPrice } from "@/lib/format";
import type { Enums } from "@/lib/supabase/types";

type Row = {
  id: string;
  slug: string;
  title: string;
  type: Enums<"course_type">;
  status: Enums<"course_status">;
  price_amount: number;
  currency: Enums<"currency_code">;
  sessions_count: number;
  updated_at: string;
};

const TYPE_LABEL: Record<Enums<"course_type">, string> = {
  curs_acreditat: "Curs acreditat",
  workshop: "Workshop",
};

const STATUS_LABEL: Record<Enums<"course_status">, string> = {
  draft: "Draft",
  published: "Publicat",
  archived: "Arhivat",
};

export function ProductsList({ items }: { items: Row[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
        Niciun curs sau workshop adăugat.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titlu</TableHead>
            <TableHead className="w-36">Tip</TableHead>
            <TableHead className="w-28">Status</TableHead>
            <TableHead className="w-28 text-right">Preț</TableHead>
            <TableHead className="w-24 text-right">Sesiuni</TableHead>
            <TableHead className="w-32">Actualizat</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <Link
                  href={`/admin/products/${c.id}`}
                  className="font-medium hover:underline"
                >
                  {c.title}
                </Link>
                <p className="text-xs text-muted-foreground">{c.slug}</p>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{TYPE_LABEL[c.type]}</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={c.status === "published" ? "default" : "outline"}
                >
                  {STATUS_LABEL[c.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatPrice(c.price_amount, c.currency)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {c.sessions_count}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(c.updated_at)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    render={
                      <Link
                        href={`/admin/products/${c.id}`}
                        aria-label="Editează"
                      />
                    }
                  >
                    <Pencil />
                  </Button>
                  <RowDeleteButton
                    onDelete={() => deleteCourse(c.id)}
                    confirmMessage={`Ștergi cursul „${c.title}"? Sesiunile, programa, imaginile și pivot-urile vor fi șterse în cascadă.`}
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
