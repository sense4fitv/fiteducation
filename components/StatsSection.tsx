"use client";

import { motion } from "framer-motion";

export default function StatsSection() {
  const stats = [
    { value: "500+", label: "Absolvenți certificați" },
    { value: "15+", label: "Traineri experți" },
    { value: "1200+", label: "Ore de curs predate" },
    { value: "8+", label: "Ani de experiență" },
    { value: "95%", label: "Rată de succes" },
  ];

  return (
    <section className="py-16 px-4 sm:px-8 lg:px-16 bg-[#FAFAFA]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0A0A0A] mb-2 font-[family-name:var(--font-space-grotesk)]">
                {stat.value}
              </h3>
              <p className="text-sm sm:text-base text-[#666666]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
