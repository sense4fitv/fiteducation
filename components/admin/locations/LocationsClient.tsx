"use client";

import { useState, useTransition } from "react";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  deleteLocation,
  saveLocation,
} from "@/app/admin/locations/_actions";
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

type Location = Tables<"locations">;

export function LocationsClient({ items }: { items: Location[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveLocation(null, formData);
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
          {items.length} locații
        </p>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus />
          Adaugă locație
        </Button>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nume</TableHead>
              <TableHead>Adresă</TableHead>
              <TableHead className="w-24">Hartă</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Nicio locație adăugată.
                </TableCell>
              </TableRow>
            ) : (
              items.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {l.address ?? "—"}
                  </TableCell>
                  <TableCell>
                    {l.map_url ? (
                      <a
                        href={l.map_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        Deschide
                        <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setEditing(l);
                          setOpen(true);
                        }}
                        aria-label="Editează"
                      >
                        <Pencil />
                      </Button>
                      <RowDeleteButton
                        onDelete={() => deleteLocation(l.id)}
                        confirmMessage={`Ștergi locația „${l.name}"? Sesiunile asociate vor rămâne fără locație.`}
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
              {editing ? "Editează locația" : "Locație nouă"}
            </SheetTitle>
            <SheetDescription>
              Locațiile pot fi atașate sesiunilor de workshop.
            </SheetDescription>
          </SheetHeader>

          <form
            key={editing?.id ?? "new"}
            action={handleSubmit}
            className="flex flex-1 flex-col gap-4 px-4"
          >
            <input type="hidden" name="id" value={editing?.id ?? ""} />

            <div className="space-y-2">
              <Label htmlFor="loc-name">Nume</Label>
              <Input
                id="loc-name"
                name="name"
                required
                defaultValue={editing?.name ?? ""}
                placeholder="ex. Greenfield Wellness"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loc-address">Adresă</Label>
              <Input
                id="loc-address"
                name="address"
                defaultValue={editing?.address ?? ""}
                placeholder="ex. Str. Exemplu nr. 12, București"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loc-map">Link Google Maps</Label>
              <Input
                id="loc-map"
                name="map_url"
                type="url"
                defaultValue={editing?.map_url ?? ""}
                placeholder="https://maps.google.com/…"
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
