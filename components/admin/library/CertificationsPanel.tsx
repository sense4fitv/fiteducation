"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  deleteCertification,
  saveCertification,
} from "@/app/admin/library/_actions";
import { RowDeleteButton } from "@/components/admin/RowDeleteButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { Tables } from "@/lib/supabase/types";

type Certification = Tables<"certifications">;

export function CertificationsPanel({ items }: { items: Certification[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveCertification(null, formData);
      if (result?.ok) {
        toast.success("Salvat");
        setOpen(false);
        setEditing(null);
      } else if (result && result.ok === false) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {items.length} certificări disponibile
        </p>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus />
          Adaugă certificare
        </Button>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nume</TableHead>
              <TableHead className="w-56">Emitent</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Nicio certificare adăugată.
                </TableCell>
              </TableRow>
            ) : (
              items.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.issuer ?? "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setEditing(c);
                          setOpen(true);
                        }}
                        aria-label="Editează"
                      >
                        <Pencil />
                      </Button>
                      <RowDeleteButton
                        onDelete={() => deleteCertification(c.id)}
                        confirmMessage={`Ștergi certificarea „${c.name}"? Va fi eliminată din toate cursurile asociate.`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editing ? "Editează certificarea" : "Certificare nouă"}
            </SheetTitle>
            <SheetDescription>
              Apar în secțiunea Certificări de pe paginile de curs.
            </SheetDescription>
          </SheetHeader>

          <form
            key={editing?.id ?? "new"}
            action={handleSubmit}
            className="flex flex-1 flex-col gap-4 px-4"
          >
            <input type="hidden" name="id" value={editing?.id ?? ""} />

            <div className="space-y-2">
              <Label htmlFor="cert-name">Nume</Label>
              <Input
                id="cert-name"
                name="name"
                required
                defaultValue={editing?.name ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cert-issuer">Emitent</Label>
              <Input
                id="cert-issuer"
                name="issuer"
                defaultValue={editing?.issuer ?? ""}
                placeholder="ex. ANC & Ministerul Muncii"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cert-desc">Descriere</Label>
              <Textarea
                id="cert-desc"
                name="description"
                rows={4}
                defaultValue={editing?.description ?? ""}
              />
            </div>

            <SheetFooter className="mt-auto -mx-4 -mb-4 border-t">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Se salvează…" : "Salvează"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
