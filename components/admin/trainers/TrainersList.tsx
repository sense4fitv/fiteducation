"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Pencil } from "lucide-react";

import { deleteTrainer } from "@/app/admin/trainers/_actions";
import { RowDeleteButton } from "@/components/admin/RowDeleteButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TrainerRow = {
  id: string;
  name: string;
  slug: string;
  instagram_url: string | null;
  photo_url: string | null;
  courses_count: number;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function TrainersList({ items }: { items: TrainerRow[] }) {
  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-14" />
            <TableHead>Nume</TableHead>
            <TableHead className="w-32">Slug</TableHead>
            <TableHead className="w-28 text-right">Cursuri</TableHead>
            <TableHead className="w-28">Instagram</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Niciun trainer adăugat.
              </TableCell>
            </TableRow>
          ) : (
            items.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <Avatar className="size-9">
                    {t.photo_url ? (
                      <Image
                        src={t.photo_url}
                        alt={t.name}
                        width={36}
                        height={36}
                        className="size-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <AvatarFallback className="text-xs">
                        {initials(t.name) || "?"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">
                  <Link
                    href={`/admin/trainers/${t.id}`}
                    className="hover:underline"
                  >
                    {t.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {t.slug}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {t.courses_count}
                </TableCell>
                <TableCell>
                  {t.instagram_url ? (
                    <a
                      href={t.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Instagram className="size-3" />
                      Deschide
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      render={
                        <Link
                          href={`/admin/trainers/${t.id}`}
                          aria-label="Editează"
                        />
                      }
                    >
                      <Pencil />
                    </Button>
                    <RowDeleteButton
                      onDelete={() => deleteTrainer(t.id)}
                      confirmMessage={`Ștergi trainerul „${t.name}"? Va fi eliminat din toate cursurile asociate, iar imaginea va fi ștearsă.`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
