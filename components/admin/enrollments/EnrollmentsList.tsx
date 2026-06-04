"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import { deleteEnrollment } from "@/app/admin/enrollments/_actions";
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

export type EnrollmentRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  status: Enums<"enrollment_status">;
  payment_method: Enums<"payment_method"> | null;
  paid_amount: number | null;
  paid_currency: Enums<"currency_code"> | null;
  course_title: string;
  created_at: string;
};

const STATUS_LABEL: Record<Enums<"enrollment_status">, string> = {
  nou: "Nou",
  contactat: "Contactat",
  confirmat: "Confirmat",
  platit: "Plătit",
  anulat: "Anulat",
};

const METHOD_LABEL: Record<Enums<"payment_method">, string> = {
  stripe: "Stripe",
  transfer: "Transfer",
  cash: "Cash",
  other: "Alt",
};

export function EnrollmentsList({ items }: { items: EnrollmentRow[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
        Nicio înscriere care să corespundă filtrelor.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nume</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Curs</TableHead>
            <TableHead className="w-24">Status</TableHead>
            <TableHead>Plată</TableHead>
            <TableHead className="w-28">Creat</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((e) => {
            const paid = e.status === "platit" || e.paid_amount != null;
            return (
              <TableRow key={e.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/admin/enrollments/${e.id}`}
                    className="hover:underline"
                  >
                    {e.full_name}
                  </Link>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <p>{e.email}</p>
                  <p>{e.phone}</p>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {e.course_title}
                </TableCell>
                <TableCell>
                  <Badge variant={e.status === "platit" ? "default" : "outline"}>
                    {STATUS_LABEL[e.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {paid ? (
                    <div className="space-y-0.5">
                      <Badge variant="default">Plătit</Badge>
                      {e.paid_amount != null && e.paid_currency ? (
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(e.paid_amount, e.paid_currency)}
                          {e.payment_method
                            ? ` · ${METHOD_LABEL[e.payment_method]}`
                            : ""}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <Badge variant="outline">Neplătit</Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(e.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      render={
                        <Link
                          href={`/admin/enrollments/${e.id}`}
                          aria-label="Detalii"
                        />
                      }
                    >
                      <Eye />
                    </Button>
                    <RowDeleteButton
                      onDelete={() => deleteEnrollment(e.id)}
                      confirmMessage={`Ștergi înscrierea pentru „${e.full_name}"? Acțiunea este permanentă.`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
