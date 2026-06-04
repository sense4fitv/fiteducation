"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  deleteAudience,
  saveAudience,
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
import type { Tables } from "@/lib/supabase/types";

type Audience = Tables<"audiences">;

export function AudiencesPanel({ items }: { items: Audience[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Audience | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveAudience(null, formData);
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
          {items.length} audiențe definite
        </p>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus />
          Adaugă audiență
        </Button>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Etichetă</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  Nicio audiență adăugată.
                </TableCell>
              </TableRow>
            ) : (
              items.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.label}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setEditing(a);
                          setOpen(true);
                        }}
                        aria-label="Editează"
                      >
                        <Pencil />
                      </Button>
                      <RowDeleteButton
                        onDelete={() => deleteAudience(a.id)}
                        confirmMessage={`Ștergi audiența „${a.label}"? Va fi eliminată din toate cursurile asociate.`}
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
              {editing ? "Editează audiența" : "Audiență nouă"}
            </SheetTitle>
            <SheetDescription>
              Apare în secțiunea Pentru cine este acest curs/workshop.
            </SheetDescription>
          </SheetHeader>

          <form
            key={editing?.id ?? "new"}
            action={handleSubmit}
            className="flex flex-1 flex-col gap-4 px-4"
          >
            <input type="hidden" name="id" value={editing?.id ?? ""} />

            <div className="space-y-2">
              <Label htmlFor="aud-label">Etichetă</Label>
              <Input
                id="aud-label"
                name="label"
                required
                defaultValue={editing?.label ?? ""}
                placeholder="ex. Începători"
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
