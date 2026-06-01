"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
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

const SECTION_LABELS = [
  "Basic Info",
  "Pricing & Schedule",
  "Content",
  "Enrollment",
  "Social Proof",
  "Trainers",
  "Meta",
];

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);

  // Accordion state — section 0 (Basic Info) open by default
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    0: true,
  });

  function toggleSection(idx: number) {
    setOpenSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

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

  // ── Shared input classes ────────────────────────────────────
  const inputCls =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8001F] focus:border-transparent text-sm";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  // ── Section renderer ────────────────────────────────────────
  function Section({
    index,
    children,
  }: {
    index: number;
    children: React.ReactNode;
  }) {
    const isOpen = openSections[index] ?? false;
    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          type="button"
          onClick={() => toggleSection(index)}
          className="w-full flex items-center justify-between py-4 px-6 hover:bg-gray-50 transition-colors text-left"
        >
          <span className="text-sm font-semibold text-gray-900">
            {SECTION_LABELS[index]}
          </span>
          {isOpen ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>
        {isOpen && <div className="px-6 pb-6 space-y-5">{children}</div>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* ── Section 0: Basic Info ────────────────────────── */}
        <Section index={0}>
          <div>
            <label className={labelCls}>
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={inputCls}
              placeholder="Product title"
            />
          </div>
          <div>
            <label className={labelCls}>
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={inputCls}
              placeholder="product-slug"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={inputCls}
              >
                <option value="course">Course</option>
                <option value="workshop">Workshop</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputCls}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputCls}
              >
                <option value="">— None —</option>
                <option value="foundation">Foundation</option>
                <option value="direction">Direction</option>
                <option value="specialization">Specialization</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputCls} resize-y`}
              placeholder="Short description"
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
        </Section>

        {/* ── Section 1: Pricing & Schedule ────────────────── */}
        <Section index={1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={inputCls}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className={labelCls}>Promo Price</label>
              <input
                type="number"
                step="0.01"
                value={promoPrice}
                onChange={(e) => setPromoPrice(e.target.value)}
                className={inputCls}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Promo Start</label>
              <input
                type="datetime-local"
                value={promoStart}
                onChange={(e) => setPromoStart(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Promo End</label>
              <input
                type="datetime-local"
                value={promoEnd}
                onChange={(e) => setPromoEnd(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className={inputCls}
                placeholder="e.g. 3 months"
              />
            </div>
            <div>
              <label className={labelCls}>Schedule</label>
              <input
                type="text"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className={inputCls}
                placeholder="e.g. Mon & Wed, 18:00-20:00"
              />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputCls}
                placeholder="e.g. Online"
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Total Spots</label>
            <input
              type="number"
              value={spotsTotal}
              onChange={(e) => setSpotsTotal(e.target.value)}
              className={inputCls}
              placeholder="e.g. 30"
            />
          </div>
        </Section>

        {/* ── Section 2: Content ───────────────────────────── */}
        <Section index={2}>
          <div>
            <label className={labelCls}>Full Description</label>
            <textarea
              rows={8}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              className={`${inputCls} resize-y`}
              placeholder="Detailed product description"
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
        </Section>

        {/* ── Section 3: Enrollment ────────────────────────── */}
        <Section index={3}>
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
        </Section>

        {/* ── Section 4: Social Proof ──────────────────────── */}
        <Section index={4}>
          <TestimonialsEditor
            value={testimonials}
            onChange={setTestimonials}
          />
          <FAQEditor value={faq} onChange={setFaq} />
        </Section>

        {/* ── Section 5: Trainers ──────────────────────────── */}
        <Section index={5}>
          <ProductTrainerPicker value={trainers} onChange={setTrainers} />
        </Section>

        {/* ── Section 6: Meta ──────────────────────────────── */}
        <Section index={6}>
          <ListEditor
            label="Tags"
            value={tags}
            onChange={setTags}
            placeholder="Add a tag"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Level</label>
              <input
                type="text"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className={inputCls}
                placeholder="e.g. Beginner"
              />
            </div>
            <div>
              <label className={labelCls}>Language</label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={inputCls}
                placeholder="Romana"
              />
            </div>
            <div>
              <label className={labelCls}>Min. Education</label>
              <input
                type="text"
                value={minEducation}
                onChange={(e) => setMinEducation(e.target.value)}
                className={inputCls}
                placeholder="e.g. High School"
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>External Checkout URL</label>
            <input
              type="text"
              value={externalCheckoutUrl}
              onChange={(e) => setExternalCheckoutUrl(e.target.value)}
              className={inputCls}
              placeholder="https://..."
            />
          </div>
        </Section>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Sticky footer ──────────────────────────────────── */}
      <div className="sticky bottom-0 bg-[#F4F4F5] pt-4 pb-2 mt-6 flex flex-col-reverse sm:flex-row gap-3">
        <Link
          href="/admin/products"
          className="inline-flex items-center justify-center px-5 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-2 bg-[#B8001F] text-white text-sm font-medium rounded-lg hover:bg-[#9a0019] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
        </button>
      </div>
    </form>
  );
}
