"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

import ImageUpload from "@/components/admin/ImageUpload";
import ListEditor from "@/components/admin/fields/ListEditor";
import CurriculumEditor from "@/components/admin/fields/CurriculumEditor";
import FAQEditor from "@/components/admin/fields/FAQEditor";
import CompetenciesEditor from "@/components/admin/fields/CompetenciesEditor";
import TestimonialsEditor from "@/components/admin/fields/TestimonialsEditor";
import FeesEditor from "@/components/admin/fields/FeesEditor";
import ExamInfoEditor from "@/components/admin/fields/ExamInfoEditor";
import CertificationsEditor from "@/components/admin/fields/CertificationsEditor";
import ProductTrainerPicker from "@/components/admin/ProductTrainerPicker";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type Product = Tables<"products"> & {
  product_trainers?: { trainer_id: string; sort_order: number | null }[];
};

interface ProductFormProps {
  product?: Product;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const selectCls =
  "w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent";

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);

  // ── Form state ──────────────────────────────────────────────
  const [title, setTitle] = useState(product?.title ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [type, setType] = useState(product?.type ?? "course");
  const [status, setStatus] = useState(product?.status ?? "draft");
  const [category, setCategory] = useState(product?.category ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(
    product?.image_url ?? null
  );

  const [price, setPrice] = useState(
    product?.price != null ? String(product.price) : ""
  );
  const [promoPrice, setPromoPrice] = useState(
    product?.promo_price != null ? String(product.promo_price) : ""
  );
  const [promoStart, setPromoStart] = useState(product?.promo_start ?? "");
  const [promoEnd, setPromoEnd] = useState(product?.promo_end ?? "");
  const [startDate, setStartDate] = useState(product?.start_date ?? "");
  const [duration, setDuration] = useState(product?.duration ?? "");
  const [schedule, setSchedule] = useState(product?.schedule ?? "");
  const [location, setLocation] = useState(product?.location ?? "");
  const [spotsTotal, setSpotsTotal] = useState(
    product?.spots_total != null ? String(product.spots_total) : ""
  );

  const [fullDescription, setFullDescription] = useState(
    product?.full_description ?? ""
  );
  const [highlights, setHighlights] = useState<string[]>(
    (product?.highlights as string[]) ?? []
  );
  const [included, setIncluded] = useState<string[]>(
    (product?.included as string[]) ?? []
  );
  const [competencies, setCompetencies] = useState<
    { title: string; icon: string; items: string[] }[]
  >((product?.competencies as { title: string; icon: string; items: string[] }[]) ?? []);
  const [curriculum, setCurriculum] = useState<
    { title: string; topics: string[] }[]
  >((product?.curriculum as { title: string; topics: string[] }[]) ?? []);

  const [requirementsDocs, setRequirementsDocs] = useState<string[]>(
    (product?.requirements_docs as string[]) ?? []
  );
  const [feesStructure, setFeesStructure] = useState<{
    inscription: string;
    monthly: string;
    total: string;
  }>(
    (product?.fees_structure as {
      inscription: string;
      monthly: string;
      total: string;
    }) ?? { inscription: "", monthly: "", total: "" }
  );
  const [examInfo, setExamInfo] = useState<{
    format: string;
    duration: string;
    passing_grade: string;
    certification: string;
  }>(
    (product?.exam_info as {
      format: string;
      duration: string;
      passing_grade: string;
      certification: string;
    }) ?? { format: "", duration: "", passing_grade: "", certification: "" }
  );
  const [certifications, setCertifications] = useState<
    { label: string; title: string; description: string }[]
  >(
    (product?.certifications as {
      label: string;
      title: string;
      description: string;
    }[]) ?? []
  );

  const [testimonials, setTestimonials] = useState<
    { name: string; role: string; text: string; image_url: string }[]
  >(
    (product?.testimonials as {
      name: string;
      role: string;
      text: string;
      image_url: string;
    }[]) ?? []
  );
  const [faq, setFaq] = useState<{ question: string; answer: string }[]>(
    (product?.faq as { question: string; answer: string }[]) ?? []
  );

  const [trainers, setTrainers] = useState<
    { trainer_id: string; sort_order: number }[]
  >(
    product?.product_trainers?.map((pt) => ({
      trainer_id: pt.trainer_id,
      sort_order: pt.sort_order ?? 0,
    })) ?? []
  );

  const [tags, setTags] = useState<string[]>(
    (product?.tags as string[]) ?? []
  );
  const [level, setLevel] = useState(product?.level ?? "");
  const [language, setLanguage] = useState(product?.language ?? "Romana");
  const [minEducation, setMinEducation] = useState(
    product?.min_education ?? ""
  );
  const [externalCheckoutUrl, setExternalCheckoutUrl] = useState(
    product?.external_checkout_url ?? ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(newTitle: string) {
    setTitle(newTitle);
    if (!isEdit) {
      setSlug(slugify(newTitle));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const productData = {
      title: title.trim(),
      slug: slug.trim(),
      type,
      status,
      category: category || null,
      description: description.trim() || null,
      image_url: imageUrl || null,
      price: parseFloat(price) || 0,
      promo_price: promoPrice ? parseFloat(promoPrice) : null,
      promo_start: promoStart || null,
      promo_end: promoEnd || null,
      start_date: startDate || null,
      duration: duration.trim() || null,
      schedule: schedule.trim() || null,
      location: location.trim() || null,
      spots_total: spotsTotal ? parseInt(spotsTotal, 10) : null,
      full_description: fullDescription.trim() || null,
      highlights: highlights.length > 0 ? highlights : null,
      included: included.length > 0 ? included : null,
      competencies: competencies.length > 0 ? competencies : null,
      curriculum: curriculum.length > 0 ? curriculum : null,
      requirements_docs: requirementsDocs.length > 0 ? requirementsDocs : null,
      fees_structure:
        feesStructure.inscription || feesStructure.monthly || feesStructure.total
          ? feesStructure
          : null,
      exam_info:
        examInfo.format ||
        examInfo.duration ||
        examInfo.passing_grade ||
        examInfo.certification
          ? examInfo
          : null,
      certifications: certifications.length > 0 ? certifications : null,
      testimonials: testimonials.length > 0 ? testimonials : null,
      faq: faq.length > 0 ? faq : null,
      tags: tags.length > 0 ? tags : null,
      level: level.trim() || null,
      language: language.trim() || null,
      min_education: minEducation.trim() || null,
      external_checkout_url: externalCheckoutUrl.trim() || null,
    };

    try {
      const supabase = createClient();
      let productId = product?.id;

      if (isEdit && product) {
        const { error: updateError } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);

        if (updateError) throw updateError;
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();

        if (insertError) throw insertError;
        productId = inserted.id;
      }

      // Sync product_trainers
      if (productId) {
        const { error: deleteError } = await supabase
          .from("product_trainers")
          .delete()
          .eq("product_id", productId);

        if (deleteError) throw deleteError;

        if (trainers.length > 0) {
          const trainerRows = trainers.map((t) => ({
            product_id: productId as string,
            trainer_id: t.trainer_id,
            sort_order: t.sort_order,
          }));

          const { error: insertTrainersError } = await supabase
            .from("product_trainers")
            .insert(trainerRows);

          if (insertTrainersError) throw insertTrainersError;
        }
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save product."
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-0">
        <Accordion multiple defaultValue={["basic-info"]}>
          {/* ── Section 0: Basic Info ────────────────────────── */}
          <AccordionItem value="basic-info">
            <AccordionTrigger className="px-6 py-4 text-sm font-semibold">
              Basic Info
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 space-y-5">
              <div>
                <Label>
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Product title"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>
                  Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="product-slug"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Type</Label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={cn(selectCls, "mt-1")}
                  >
                    <option value="course">Course</option>
                    <option value="workshop">Workshop</option>
                  </select>
                </div>
                <div>
                  <Label>Status</Label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={cn(selectCls, "mt-1")}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <Label>Category</Label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={cn(selectCls, "mt-1")}
                  >
                    <option value="">— None —</option>
                    <option value="foundation">Foundation</option>
                    <option value="direction">Direction</option>
                    <option value="specialization">Specialization</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description"
                  className="mt-1 resize-y"
                />
              </div>
              <div>
                <ImageUpload
                  bucket="product-images"
                  value={imageUrl}
                  onChange={(url) => setImageUrl(url)}
                  label="Product Image"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ── Section 1: Pricing & Schedule ────────────────── */}
          <AccordionItem value="pricing-schedule">
            <AccordionTrigger className="px-6 py-4 text-sm font-semibold">
              Pricing &amp; Schedule
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>
                    Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Promo Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={promoPrice}
                    onChange={(e) => setPromoPrice(e.target.value)}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Promo Start</Label>
                  <Input
                    type="datetime-local"
                    value={promoStart}
                    onChange={(e) => setPromoStart(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Promo End</Label>
                  <Input
                    type="datetime-local"
                    value={promoEnd}
                    onChange={(e) => setPromoEnd(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Duration</Label>
                  <Input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 3 months"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Schedule</Label>
                  <Input
                    type="text"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    placeholder="e.g. Mon & Wed, 18:00-20:00"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Online"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Total Spots</Label>
                <Input
                  type="number"
                  value={spotsTotal}
                  onChange={(e) => setSpotsTotal(e.target.value)}
                  placeholder="e.g. 30"
                  className="mt-1"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ── Section 2: Content ───────────────────────────── */}
          <AccordionItem value="content">
            <AccordionTrigger className="px-6 py-4 text-sm font-semibold">
              Content
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 space-y-5">
              <div>
                <Label>Full Description</Label>
                <Textarea
                  rows={8}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="Detailed product description"
                  className="mt-1 resize-y"
                />
              </div>
              <ListEditor
                label="Highlights"
                value={highlights}
                onChange={setHighlights}
                placeholder="Add a highlight"
              />
              <ListEditor
                label="Included"
                value={included}
                onChange={setIncluded}
                placeholder="What's included"
              />
              <CompetenciesEditor
                value={competencies}
                onChange={setCompetencies}
              />
              <CurriculumEditor value={curriculum} onChange={setCurriculum} />
            </AccordionContent>
          </AccordionItem>

          {/* ── Section 3: Enrollment ────────────────────────── */}
          <AccordionItem value="enrollment">
            <AccordionTrigger className="px-6 py-4 text-sm font-semibold">
              Enrollment
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 space-y-5">
              <ListEditor
                label="Requirements / Documents"
                value={requirementsDocs}
                onChange={setRequirementsDocs}
                placeholder="Add a requirement"
              />
              <FeesEditor value={feesStructure} onChange={setFeesStructure} />
              <ExamInfoEditor value={examInfo} onChange={setExamInfo} />
              <CertificationsEditor
                value={certifications}
                onChange={setCertifications}
              />
            </AccordionContent>
          </AccordionItem>

          {/* ── Section 4: Social Proof ──────────────────────── */}
          <AccordionItem value="social-proof">
            <AccordionTrigger className="px-6 py-4 text-sm font-semibold">
              Social Proof
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 space-y-5">
              <TestimonialsEditor
                value={testimonials}
                onChange={setTestimonials}
              />
              <FAQEditor value={faq} onChange={setFaq} />
            </AccordionContent>
          </AccordionItem>

          {/* ── Section 5: Trainers ──────────────────────────── */}
          <AccordionItem value="trainers">
            <AccordionTrigger className="px-6 py-4 text-sm font-semibold">
              Trainers
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 space-y-5">
              <ProductTrainerPicker value={trainers} onChange={setTrainers} />
            </AccordionContent>
          </AccordionItem>

          {/* ── Section 6: Meta ──────────────────────────────── */}
          <AccordionItem value="meta">
            <AccordionTrigger className="px-6 py-4 text-sm font-semibold">
              Meta
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 space-y-5">
              <ListEditor
                label="Tags"
                value={tags}
                onChange={setTags}
                placeholder="Add a tag"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Level</Label>
                  <Input
                    type="text"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    placeholder="e.g. Beginner"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Language</Label>
                  <Input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="Romana"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Min. Education</Label>
                  <Input
                    type="text"
                    value={minEducation}
                    onChange={(e) => setMinEducation(e.target.value)}
                    placeholder="e.g. High School"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>External Checkout URL</Label>
                <Input
                  type="text"
                  value={externalCheckoutUrl}
                  onChange={(e) => setExternalCheckoutUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Sticky footer ──────────────────────────────────── */}
      <div className="sticky bottom-0 bg-[#F4F4F5] pt-4 pb-2 mt-6 flex flex-col-reverse sm:flex-row gap-3">
        <Button variant="outline" render={<Link href="/admin/products" />}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
        </Button>
      </div>
    </form>
  );
}
