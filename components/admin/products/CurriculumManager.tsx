"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  deleteCurriculumItem,
  deleteCurriculumSection,
  reorderCurriculumItems,
  reorderCurriculumSections,
  saveCurriculumItem,
  saveCurriculumSection,
} from "@/app/admin/products/_actions";
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
import { Textarea } from "@/components/ui/textarea";
import type { Tables } from "@/lib/supabase/types";

type Section = Tables<"curriculum_sections">;
type Item = Tables<"curriculum_items">;

export type SectionWithItems = Section & { items: Item[] };

function swap<T>(arr: T[], i: number, j: number): T[] {
  if (i < 0 || j < 0 || i >= arr.length || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

export function CurriculumManager({
  courseId,
  sections,
}: {
  courseId: string;
  sections: SectionWithItems[];
}) {
  const [sectionOpen, setSectionOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [itemOpen, setItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    sectionId: string;
    item: Item | null;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  function openCreateSection() {
    setEditingSection(null);
    setSectionOpen(true);
  }
  function openEditSection(s: Section) {
    setEditingSection(s);
    setSectionOpen(true);
  }
  function openCreateItem(sectionId: string) {
    setEditingItem({ sectionId, item: null });
    setItemOpen(true);
  }
  function openEditItem(sectionId: string, item: Item) {
    setEditingItem({ sectionId, item });
    setItemOpen(true);
  }

  function submitSection(fd: FormData) {
    fd.set("course_id", courseId);
    startTransition(async () => {
      const result = await saveCurriculumSection(null, fd);
      if (result?.ok) {
        toast.success("Salvat");
        setSectionOpen(false);
      } else if (result && result.ok === false) {
        toast.error(result.error);
      }
    });
  }

  function submitItem(fd: FormData) {
    fd.set("course_id", courseId);
    if (editingItem) fd.set("section_id", editingItem.sectionId);
    startTransition(async () => {
      const result = await saveCurriculumItem(null, fd);
      if (result?.ok) {
        toast.success("Salvat");
        setItemOpen(false);
      } else if (result && result.ok === false) {
        toast.error(result.error);
      }
    });
  }

  function moveSection(index: number, dir: -1 | 1) {
    const reordered = swap(sections, index, index + dir);
    if (reordered === sections) return;
    startTransition(async () => {
      try {
        await reorderCurriculumSections(
          courseId,
          reordered.map((s) => s.id),
        );
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Eroare");
      }
    });
  }

  function moveItem(sectionId: string, items: Item[], index: number, dir: -1 | 1) {
    const reordered = swap(items, index, index + dir);
    if (reordered === items) return;
    startTransition(async () => {
      try {
        await reorderCurriculumItems(
          courseId,
          sectionId,
          reordered.map((i) => i.id),
        );
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Eroare");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {sections.length} secțiuni
        </p>
        <Button onClick={openCreateSection}>
          <Plus /> Secțiune nouă
        </Button>
      </div>

      {sections.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          Nicio secțiune de programa adăugată.
        </div>
      ) : (
        <ul className="space-y-3">
          {sections.map((s, si) => (
            <li
              key={s.id}
              className="rounded-lg border border-border bg-card"
            >
              <header className="flex items-start justify-between gap-3 border-b border-border p-4">
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium">{s.title}</p>
                  {s.subtitle ? (
                    <p className="text-xs text-muted-foreground">
                      {s.subtitle}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Mută în sus"
                    disabled={si === 0 || isPending}
                    onClick={() => moveSection(si, -1)}
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Mută în jos"
                    disabled={si === sections.length - 1 || isPending}
                    onClick={() => moveSection(si, 1)}
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Editează secțiunea"
                    onClick={() => openEditSection(s)}
                  >
                    <Pencil />
                  </Button>
                  <RowDeleteButton
                    onDelete={() => deleteCurriculumSection(s.id, courseId)}
                    confirmMessage={`Ștergi secțiunea „${s.title}"? Bullet-urile asociate vor fi șterse.`}
                  />
                </div>
              </header>

              <ul className="divide-y divide-border">
                {s.items.length === 0 ? (
                  <li className="p-4 text-center text-sm text-muted-foreground">
                    Niciun bullet în secțiune.
                  </li>
                ) : (
                  s.items.map((it, ii) => (
                    <li
                      key={it.id}
                      className="flex items-start gap-3 p-3"
                    >
                      <p className="flex-1 text-sm">{it.content}</p>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Mută în sus"
                          disabled={ii === 0 || isPending}
                          onClick={() => moveItem(s.id, s.items, ii, -1)}
                        >
                          <ArrowUp />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Mută în jos"
                          disabled={ii === s.items.length - 1 || isPending}
                          onClick={() => moveItem(s.id, s.items, ii, 1)}
                        >
                          <ArrowDown />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Editează"
                          onClick={() => openEditItem(s.id, it)}
                        >
                          <Pencil />
                        </Button>
                        <RowDeleteButton
                          onDelete={() => deleteCurriculumItem(it.id, courseId)}
                          confirmMessage="Ștergi acest bullet?"
                        />
                      </div>
                    </li>
                  ))
                )}
              </ul>

              <footer className="border-t border-border p-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openCreateItem(s.id)}
                >
                  <Plus /> Adaugă bullet
                </Button>
              </footer>
            </li>
          ))}
        </ul>
      )}

      {/* Section sheet */}
      <Sheet open={sectionOpen} onOpenChange={setSectionOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editingSection ? "Editează secțiunea" : "Secțiune nouă"}
            </SheetTitle>
            <SheetDescription>
              {'ex. „Ziua 1 – Fundamentele mișcării"'}
            </SheetDescription>
          </SheetHeader>
          <form
            key={editingSection?.id ?? "new-section"}
            action={submitSection}
            className="flex flex-1 flex-col gap-4 px-4"
          >
            <input type="hidden" name="id" value={editingSection?.id ?? ""} />
            <div className="space-y-2">
              <Label htmlFor="cs-title">Titlu</Label>
              <Input
                id="cs-title"
                name="title"
                required
                defaultValue={editingSection?.title ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cs-sub">Subtitlu</Label>
              <Textarea
                id="cs-sub"
                name="subtitle"
                rows={2}
                defaultValue={editingSection?.subtitle ?? ""}
                placeholder="ex. Ziua 1 creează fundamentul…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cs-sort">Ordine</Label>
              <Input
                id="cs-sort"
                name="sort_order"
                type="number"
                defaultValue={editingSection?.sort_order ?? 0}
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

      {/* Item sheet */}
      <Sheet open={itemOpen} onOpenChange={setItemOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editingItem?.item ? "Editează bullet-ul" : "Bullet nou"}
            </SheetTitle>
          </SheetHeader>
          <form
            key={editingItem?.item?.id ?? `new-item-${editingItem?.sectionId}`}
            action={submitItem}
            className="flex flex-1 flex-col gap-4 px-4"
          >
            <input
              type="hidden"
              name="id"
              value={editingItem?.item?.id ?? ""}
            />
            <div className="space-y-2">
              <Label htmlFor="ci-content">Conținut</Label>
              <Textarea
                id="ci-content"
                name="content"
                rows={4}
                required
                defaultValue={editingItem?.item?.content ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ci-sort">Ordine</Label>
              <Input
                id="ci-sort"
                name="sort_order"
                type="number"
                defaultValue={editingItem?.item?.sort_order ?? 0}
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
