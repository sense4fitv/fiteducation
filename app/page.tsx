import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import StatsBar from "@/components/StatsBar";
import CoursesSection from "@/components/CoursesSection";
import TrainersSection from "@/components/TrainersSection";
import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

import {
  listAllTrainers,
  listHeroCourses,
  listPublishedCourses,
} from "@/lib/supabase/queries/public";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [heroCourses, allCourses, trainers] = await Promise.all([
    listHeroCourses(),
    listPublishedCourses(),
    listAllTrainers(),
  ]);

  const accredited = allCourses.filter((c) => c.type === "curs_acreditat");
  const workshops = allCourses.filter((c) => c.type === "workshop");

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <HeroSlider courses={heroCourses} />
      <StatsBar />

      <div id="specializari">
        <CoursesSection
          id="cursuri-acreditate"
          eyebrow="Programe acreditate"
          title="Cursuri acreditate"
          description="Programe complete de formare profesională acreditate ANC & Ministerul Muncii, cu certificare recunoscută internațional."
          courses={accredited}
          variant="large"
        />

        <CoursesSection
          id="workshopuri"
          eyebrow="Specializări"
          title="Workshop-uri"
          description="Experiențe educaționale intensive, susținute de traineri de renume internațional, pentru pasionați și profesioniști din fitness."
          courses={workshops}
          variant="compact"
        />
      </div>

      <TrainersSection trainers={trainers} />
      <CTASection />
      <FAQSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
