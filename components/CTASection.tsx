"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function CTASection() {
  const features = [
    "Experiență internațională",
    "Beneficii parteneri internaționali",
    "Traineri cu experiență",
    "Locații premium",
    "Platformă online dedicată dezvoltării permanente",
    "Programe diversificate",
  ];


  return (
    <section
      id="contact"
      className="py-20 px-4 sm:px-8 lg:px-16 bg-white"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16"
        >
            {/* Left Side - Content */}
            <div className="flex flex-col justify-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0A0A0A] mb-6 font-[family-name:var(--font-space-grotesk)]"
              >
                Ce ne face diferiți?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg text-[#666666] mb-8 leading-relaxed"
              >
                Suntem o comunitate dedicată să te ajute să îți atingi
                obiectivele în fitness într-un mediu prietenos și suportiv.
              </motion.p>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
              >
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 size={24} className="text-[#B8001F] flex-shrink-0" />
                    <span className="text-[#0A0A0A] font-medium">{feature}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                href="#specializari"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-8 py-4 bg-[#B8001F] text-white rounded-full font-semibold text-lg hover:bg-[#490207] transition-all duration-300 hover:shadow-lg hover:shadow-[#B8001F]/50 w-fit"
              >
                Descoperă cursurile
              </motion.a>
            </div>

            {/* Right Side - Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[400px] lg:h-full min-h-[400px] rounded-xl overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </motion.div>
          </motion.div>
      </div>
    </section>
  );
}
