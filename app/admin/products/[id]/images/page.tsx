import { notFound } from "next/navigation";

import {
  removeCourseCover,
  removeCourseHero,
  uploadCourseCover,
  uploadCourseHero,
} from "@/app/admin/products/_actions";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SubrouteHeader } from "@/components/admin/products/SubrouteHeader";
import { assertAdmin } from "@/lib/supabase/guards";
import { COURSE_BUCKET, publicUrl } from "@/lib/supabase/storage";

export const dynamic = "force-dynamic";

export default async function CourseImagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await assertAdmin();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, cover_image_path, hero_image_path, cover_image_alt")
    .eq("id", id)
    .maybeSingle();
  if (!course) notFound();

  const coverUrl = publicUrl(COURSE_BUCKET, course.cover_image_path);
  const heroUrl = publicUrl(COURSE_BUCKET, course.hero_image_path);

  return (
    <div className="space-y-6 p-6">
      <SubrouteHeader
        courseId={id}
        courseTitle={course.title}
        title="Imagini"
        description="Coperta apare în card-uri și listing. Hero-ul (opțional) apare pe slider-ul paginii principale; dacă lipsește, se folosește coperta."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <ImageUploader
          entityId={id}
          currentUrl={coverUrl}
          uploadAction={uploadCourseCover}
          removeAction={removeCourseCover}
          label="Cover (card / listing)"
          hint="Recomandat 4:3 sau 16:10. Max 5 MB."
        />
        <ImageUploader
          entityId={id}
          currentUrl={heroUrl}
          uploadAction={uploadCourseHero}
          removeAction={removeCourseHero}
          label="Hero (slider pagina principală)"
          hint="Recomandat 21:9 sau 16:9. Lasă gol pentru a folosi cover-ul. Max 5 MB."
        />
      </div>
    </div>
  );
}
