"use client";

import { motion } from "framer-motion";

export default function ComparisonSection() {
  const features = [
    { name: "Certificare internațională", us: true, others: false },
    { name: "Job placement 95%+", us: true, others: false },
    { name: "Traineri cu experiență 10+ ani", us: true, others: false },
    { name: "Facilități moderne", us: true, others: true },
    { name: "Suport post-certificare", us: true, others: false },
    { name: "Plată în rate fără dobândă", us: true, others: false },
    { name: "Materiale de curs actualizate", us: true, others: true },
    { name: "Practică hands-on", us: true, others: true },
  ];

  return (
    <section className="py-20 px-4 sm:px-8 lg:px-16 bg-white">
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0A0A0A] mb-4 font-[family-name:var(--font-unbounded)]">
            De ce Fiteducation?
          </h2>
          <p className="text-lg text-[#666666]">
            Compară și alege cel mai bun program pentru cariera ta
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overflow-x-auto"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 sm:px-6 text-[#666666] font-medium">
                  Caracteristici
                </th>
                <th className="py-4 px-4 sm:px-6 text-center">
                  <span className="inline-block px-4 py-2 bg-[#B8001F] text-white rounded-lg font-bold">
                    Fiteducation
                  </span>
                </th>
                <th className="py-4 px-4 sm:px-6 text-center text-[#666666] font-medium">
                  Alte școli
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4 sm:px-6 text-[#0A0A0A]">
                    {feature.name}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-center">
                    {feature.us ? (
                      <span className="text-[#B8001F] text-xl font-bold">✓</span>
                    ) : (
                      <span className="text-gray-300 text-xl">−</span>
                    )}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-center">
                    {feature.others ? (
                      <span className="text-gray-400 text-xl">✓</span>
                    ) : (
                      <span className="text-gray-300 text-xl">−</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="#specializari"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#B8001F] text-white rounded-full font-semibold text-lg hover:bg-[#490207] transition-all duration-300 hover:shadow-lg hover:shadow-[#B8001F]/50"
          >
            Începe acum
          </a>
        </motion.div>
      </div>
    </section>
  );
}
