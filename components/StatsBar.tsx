"use client";

import { motion } from "framer-motion";

export default function StatsBar() {
  const stats = [
    {
      value: "500",
      label: "Absolvenți certificați",
    },
    {
      value: "15",
      label: "Traineri experți",
    },
    {
      value: "1200",
      label: "Ore de curs predate",
    },
    {
      value: "8",
      label: "Ani de experiență",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-8 lg:px-16">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="mb-3">
                  <span className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#0A0A0A] font-[family-name:var(--font-space-grotesk)]">
                    {stat.value}
                  </span>
                  <span className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#B8001F] font-[family-name:var(--font-space-grotesk)]">
                    +
                  </span>
                </div>
                <p className="text-sm sm:text-base text-[#666666] font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
