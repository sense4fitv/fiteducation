"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import { deleteSession, saveSession } from "@/app/admin/products/_actions";
import { RowDeleteButton } from "@/components/admin/RowDeleteButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { formatDateRange } from "@/lib/format";
import type { Tables } from "@/lib/supabase/types";

type Session = Tables<"course_sessions">;
type Location = Tables<"locations">;

const NONE = "__none__";

export function SessionsManager({
  courseId,
  items,
  locations,
}: {
  courseId: string;
  items: Session[];
  locations: Location[];
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Session | null>(null);
  const [locationId, setLocationId] = useState<string>(NONE);
  const [isPending, startTransition] = useTransition();

  function openCreate() {
    setEditing(null);
    setLocationId(NONE);
    setOpen(true);
  }
  function openEdit(s: Session) {
    setEditing(s);
    setLocationId(s.location_id ?? NONE);
    setOpen(true);
  }

  function handleSubmit(fd: FormData) {
    fd.set("course_id", courseId);
    fd.set("location_id", locationId === NONE ? "" : locationId);
    startTransition(async () => {
      const result = await saveSession(null, fd);
      if (result?.ok) {
        toast.success("Salvat");
        setOpen(false);
        setEditing(null);
      } else if (result && result.ok === false) {
        toast.error(result.error);
      }
    });
  }

  const locationName = (id: string | null) =>
    id ? (locations.find((l) => l.id === id)?.name ?? "—") : "—";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {items.length} sesiuni programate
        </p>
        <Button onClick={openCreate}>
          <Plus /> Sesiune nouă
        </Button>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Perioadă</TableHead>
              <TableHead>Locație</TableHead>
              <TableHead>Notă</TableHead>
              <TableHead className="w-20 text-right">Ordine</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nicio sesiune programată.
                </TableCell>
              </TableRow>
            ) : (
              items.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">
                    {formatDateRange(s.start_date, s.end_date)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {locationName(s.location_id)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.note ?? "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {s.sort_order}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Editează"
                        onClick={() => openEdit(s)}
                      >
                        <Pencil />
                      </Button>
                      <RowDeleteButton
                        onDelete={() => deleteSession(s.id, courseId)}
                        confirmMessage="Ștergi această sesiune?"
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
              {editing ? "Editează sesiunea" : "Sesiune nouă"}
            </SheetTitle>
            <SheetDescription>
              {'Lasă datele goale pentru sesiuni TBA (vor apărea ca „Datele vor fi anunțate").'}
            </SheetDescription>
          </SheetHeader>

          <form
            key={editing?.id ?? "new"}
            action={handleSubmit}
            className="flex flex-1 flex-col gap-4 px-4"
          >
            <input type="hidden" name="id" value={editing?.id ?? ""} />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="s-start">Început</Label>
                <Input
                  id="s-start"
                  name="start_date"
                  type="date"
                  defaultValue={editing?.start_date ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-end">Sfârșit</Label>
                <Input
                  id="s-end"
                  name="end_date"
                  type="date"
                  defaultValue={editing?.end_date ?? ""}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Locație</Label>
              <Select
                value={locationId}
                onValueChange={(v) => setLocationId(v ?? NONE)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Fără locație</SelectItem>
                  {locations.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-note">Notă</Label>
              <Textarea
                id="s-note"
                name="note"
                rows={3}
                defaultValue={editing?.note ?? ""}
                placeholder="ex. Desfășurat pe 2–4 weekenduri…"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-sort">Ordine</Label>
              <Input
                id="s-sort"
                name="sort_order"
                type="number"
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
