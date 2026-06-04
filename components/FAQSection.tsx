"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Trebuie să am experiență în fitness pentru a mă înscrie?",
      answer:
        "Nu este necesar să ai experiență anterioară. Cursul Foundation acoperă toate bazele necesare, de la anatomie și fiziologie până la principiile antrenamentului. Mulți dintre absolvenții noștri au venit fără experiență în domeniu.",
    },
    {
      question: "Certificarea este recunoscută internațional?",
      answer:
        "Da, certificarea noastră este recunoscută internațional și respectă standardele ACE și NASM. Poți lucra ca trainer certificat în România și în majoritatea țărilor europene.",
    },
    {
      question: "Pot lucra în timpul cursului?",
      answer:
        "Absolut! Cursurile sunt structurate flexibil, cu sesiuni în weekend și seara, tocmai pentru a permite participanților să își mențină programul de lucru actual.",
    },
    {
      question: "Care este rata de angajare după absolvire?",
      answer:
        "95% dintre absolvenții noștri găsesc un loc de muncă în domeniu în maximum 3 luni de la finalizarea cursului. Avem parteneriate cu peste 50 de săli de sport și studiouri de fitness care angajează constant.",
    },
    {
      question: "Există facilități de plată?",
      answer:
        "Da, oferim opțiuni de plată în rate pentru toate pachetele de cursuri. Poți alege să plătești în 3, 6 sau 12 rate, fără dobândă. Contactează-ne pentru detalii specifice.",
    },
    {
      question: "Ce se întâmplă dacă nu pot finaliza cursul?",
      answer:
        "Înțelegem că pot apărea situații neprevăzute. Oferim posibilitatea de a întrerupe temporar cursul și a-l relua la următoarea sesiune, fără costuri suplimentare. De asemenea, ai garanție de returnare a banilor în primele 14 zile.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-8 lg:px-16 bg-[#FAFAFA]">
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
            Întrebări frecvente
          </h2>
          <p className="text-lg text-[#666666]">
            Răspunsuri la cele mai comune întrebări
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-[#0A0A0A] pr-4">
                  {faq.question}
                </h3>
                <span className="text-2xl text-[#666666] flex-shrink-0">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-[#666666] leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
