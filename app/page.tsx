import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import StatsBar from "@/components/StatsBar";
import Configurator from "@/components/Configurator";
import TrainersSection from "@/components/TrainersSection";
import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ExitIntentPopup from "@/components/ExitIntentPopup";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <HeroSlider />
      <StatsBar />
      <Configurator />
      <TrainersSection />
      <CTASection />
      <FAQSection />
      <Footer />

      {/* Global Components */}
      <WhatsAppButton />
      <ExitIntentPopup />
    </div>
  );
}
