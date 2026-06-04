"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateCourseCore } from "@/app/admin/products/_actions";
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
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slug";
import type { Enums, Tables } from "@/lib/supabase/types";

type Course = Tables<"courses">;

export function CourseCoreForm({ course }: { course: Course }) {
  const [title, setTitle] = useState(course.title);
  const [slug, setSlug] = useState(course.slug);
  const [slugTouched, setSlugTouched] = useState(true);
  const [type, setType] = useState<Enums<"course_type">>(course.type);
  const [currency, setCurrency] = useState<Enums<"currency_code">>(
    course.currency,
  );
  const [status, setStatus] = useState<Enums<"course_status">>(course.status);
  const [klarna, setKlarna] = useState<boolean>(course.klarna_enabled);
  const [requiresBac, setRequiresBac] = useState<boolean>(
    course.requires_bacalaureat,
  );
  const [showInHero, setShowInHero] = useState<boolean>(course.show_in_hero);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(fd: FormData) {
    fd.set("type", type);
    fd.set("currency", currency);
    fd.set("status", status);
    fd.set("klarna_enabled", klarna ? "on" : "off");
    fd.set("requires_bacalaureat", requiresBac ? "on" : "off");
    fd.set("show_in_hero", showInHero ? "on" : "off");
    startTransition(async () => {
      const result = await updateCourseCore(null, fd);
      if (result?.ok) toast.success("Salvat");
      else if (result && result.ok === false) toast.error(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={course.id} />

      <section className="space-y-4 rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-muted-foreground">Identitate</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="cc-title">Titlu</Label>
            <Input
              id="cc-title"
              name="title"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cc-slug">Slug</Label>
            <Input
              id="cc-slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Tip</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as Enums<"course_type">)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="curs_acreditat">Curs acreditat</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="cc-motto">Motto</Label>
            <Input
              id="cc-motto"
              name="motto"
              defaultValue={course.motto ?? ""}
              placeholder="ex. Devino antrenor personal certificat internațional"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="cc-desc">Descriere</Label>
            <Textarea
              id="cc-desc"
              name="description"
              rows={8}
              defaultValue={course.description ?? ""}
            />
            <p className="text-xs text-muted-foreground">
              Markdown acceptat. Apare pe pagina de produs.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-muted-foreground">Preț & livrare</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="cc-price">Preț</Label>
            <Input
              id="cc-price"
              name="price_amount"
              type="number"
              step="0.01"
              min={0}
              required
              defaultValue={course.price_amount}
            />
          </div>
          <div className="space-y-2">
            <Label>Monedă</Label>
            <Select
              value={currency}
              onValueChange={(v) => setCurrency(v as Enums<"currency_code">)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RON">RON</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cc-full">Preț plată integrală</Label>
            <Input
              id="cc-full"
              name="full_payment_price"
              type="number"
              step="0.01"
              min={0}
              defaultValue={course.full_payment_price ?? ""}
              placeholder="Opțional"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cc-hours">Durată (ore)</Label>
            <Input
              id="cc-hours"
              name="duration_hours"
              type="number"
              min={1}
              required
              defaultValue={course.duration_hours}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cc-launch">Data lansării</Label>
            <Input
              id="cc-launch"
              name="launch_date"
              type="date"
              defaultValue={course.launch_date ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cc-lang">Limbă</Label>
            <Input
              id="cc-lang"
              name="language"
              defaultValue={course.language}
            />
          </div>
          <div className="flex items-center gap-2 md:col-span-3">
            <input
              id="cc-klarna"
              type="checkbox"
              className="size-4 rounded border-border"
              checked={klarna}
              onChange={(e) => setKlarna(e.target.checked)}
            />
            <Label htmlFor="cc-klarna" className="cursor-pointer">
              Plată în rate prin Klarna disponibilă
            </Label>
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="cc-banner">Text bară de anunț</Label>
            <Input
              id="cc-banner"
              name="announcement_bar_text"
              defaultValue={course.announcement_bar_text ?? ""}
              placeholder="ex. DISCOUNT la plata integrală: 7500 lei"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-muted-foreground">Cerințe & vizibilitate</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="cc-age">Vârstă minimă</Label>
            <Input
              id="cc-age"
              name="min_age"
              type="number"
              min={0}
              defaultValue={course.min_age}
            />
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <input
              id="cc-bac"
              type="checkbox"
              className="size-4 rounded border-border"
              checked={requiresBac}
              onChange={(e) => setRequiresBac(e.target.checked)}
            />
            <Label htmlFor="cc-bac" className="cursor-pointer">
              Necesită diplomă de Bacalaureat
            </Label>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as Enums<"course_status">)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Publicat</SelectItem>
                <SelectItem value="archived">Arhivat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <input
              id="cc-hero"
              type="checkbox"
              className="size-4 rounded border-border"
              checked={showInHero}
              onChange={(e) => setShowInHero(e.target.checked)}
            />
            <Label htmlFor="cc-hero" className="cursor-pointer">
              Afișează în slider-ul hero al paginii principale
            </Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cc-hero-order">Ordine hero</Label>
            <Input
              id="cc-hero-order"
              name="hero_sort_order"
              type="number"
              defaultValue={course.hero_sort_order ?? ""}
              placeholder="Opțional"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="cc-alt">Text alternativ imagine de copertă</Label>
            <Input
              id="cc-alt"
              name="cover_image_alt"
              defaultValue={course.cover_image_alt ?? ""}
            />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Se salvează…" : "Salvează modificări"}
        </Button>
      </div>
    </form>
  );
}
