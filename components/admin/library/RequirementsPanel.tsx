"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  deleteRequirement,
  saveRequirement,
} from "@/app/admin/library/_actions";
import { RowDeleteButton } from "@/components/admin/RowDeleteButton";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Enums, Tables } from "@/lib/supabase/types";

type Requirement = Tables<"requirements">;

const CATEGORIES: { value: Enums<"requirement_category">; label: string }[] = [
  { value: "inscriere", label: "Înscriere" },
  { value: "acte", label: "Acte" },
  { value: "participare", label: "Participare" },
  { value: "examen", label: "Examen" },
];

const CATEGORY_LABEL: Record<Enums<"requirement_category">, string> = {
  inscriere: "Înscriere",
  acte: "Acte",
  participare: "Participare",
  examen: "Examen",
};

export function RequirementsPanel({ items }: { items: Requirement[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Requirement | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveRequirement(null, formData);
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
          {items.length} cerințe partajate
        </p>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus />
          Adaugă cerință
        </Button>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Etichetă</TableHead>
              <TableHead className="w-40">Categorie</TableHead>
              <TableHead className="w-20 text-right">Ordine</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Nicio cerință adăugată.
                </TableCell>
              </TableRow>
            ) : (
              items.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.label}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{CATEGORY_LABEL[r.category]}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {r.sort_order}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setEditing(r);
                          setOpen(true);
                        }}
                        aria-label="Editează"
                      >
                        <Pencil />
                      </Button>
                      <RowDeleteButton
                        onDelete={() => deleteRequirement(r.id)}
                        confirmMessage={`Ștergi cerința „${r.label}"? Va fi eliminată din toate cursurile asociate.`}
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
              {editing ? "Editează cerința" : "Cerință nouă"}
            </SheetTitle>
            <SheetDescription>
              Cerințele apar pe paginile de curs în secțiunile Condiții de
              înscriere, Acte necesare, Participare și Examen.
            </SheetDescription>
          </SheetHeader>

          <form
            key={editing?.id ?? "new"}
            action={handleSubmit}
            className="flex flex-1 flex-col gap-4 px-4"
          >
            <input type="hidden" name="id" value={editing?.id ?? ""} />

            <div className="space-y-2">
              <Label htmlFor="req-label">Etichetă</Label>
              <Input
                id="req-label"
                name="label"
                required
                defaultValue={editing?.label ?? ""}
                placeholder={'ex. Adeverință medicală „apt pentru efort fizic"'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="req-category">Categorie</Label>
              <Select
                name="category"
                defaultValue={editing?.category ?? "inscriere"}
              >
                <SelectTrigger id="req-category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="req-sort">Ordine</Label>
              <Input
                id="req-sort"
                name="sort_order"
                type="number"
                min={0}
                defaultValue={editing?.sort_order ?? 0}
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
