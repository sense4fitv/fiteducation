import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import StatsBar from "@/components/StatsBar";
import Configurator from "@/components/Configurator";
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
import {
  splitByCategory,
  toSpecializationVM,
} from "@/lib/specialization-vm";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [heroCourses, allCourses, trainers] = await Promise.all([
    listHeroCourses(),
    listPublishedCourses(),
    listAllTrainers(),
  ]);

  const vms = allCourses.map(toSpecializationVM);
  const { foundations, specializations } = splitByCategory(vms);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <HeroSlider courses={heroCourses} />
      <StatsBar />
      <Configurator
        foundations={foundations}
        specializations={specializations}
      />
      <TrainersSection trainers={trainers} />
      <CTASection />
      <FAQSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
