"use client";

import { motion } from "framer-motion";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const legalLinks = [
    { label: "Termeni & Condiții", href: "/termeni-si-conditii" },
    { label: "Politica de confidențialitate", href: "/politica-de-confidentialitate" },
    { label: "Politica de cookies", href: "/politica-de-cookies" },
  ];

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/fiteducationschool?igsh=MXBrOXgzNDJrY2E3bw==",
      label: "Instagram",
    },
  ];

  return (
    <footer id="contact" className="bg-[#0A0A0A] text-white py-16 px-4 sm:px-8 lg:px-16">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 gap-12 mb-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <img
              src="/LogoFiteducation.svg"
              alt="Fiteducation"
              className="h-10 w-auto mb-4"
            />
            <p className="text-[#A0A0A0] leading-relaxed">
              Transformăm pasiunea pentru fitness în cariere de succes.
              Alătură-te comunității noastre și devino un profesionist
              certificat în industria fitness.
            </p>
          </motion.div>

          {/* Date firmă */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <h3 className="text-lg font-bold mb-4 font-[family-name:var(--font-unbounded)]">
              Date firmă
            </h3>
            <ul className="space-y-3 text-sm text-[#A0A0A0]">
              <li className="text-white font-medium">
                Asociația Club Sportiv Fiteducation
              </li>
              <li>CUI: 33415055</li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#666]" />
                <span>Strada Tablei nr. 8, Brașov</span>
              </li>
              <li>
                <a
                  href="mailto:office@fiteducationschool.com"
                  className="flex items-start gap-2 hover:text-[#B8001F] transition-colors"
                >
                  <Mail size={16} className="mt-0.5 shrink-0 text-[#666]" />
                  <span>office@fiteducationschool.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+40740988678"
                  className="flex items-start gap-2 hover:text-[#B8001F] transition-colors"
                >
                  <Phone size={16} className="mt-0.5 shrink-0 text-[#666]" />
                  <span>+40 740 988 678</span>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Protecția consumatorilor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold mb-4 font-[family-name:var(--font-unbounded)]">
              Protecția consumatorilor
            </h3>
            <ul className="space-y-3 text-sm text-[#A0A0A0]">
              <li className="text-white font-medium">
                ANPC – Autoritatea Națională pentru Protecția Consumatorilor
              </li>
              <li>
                <a
                  href="https://www.anpc.ro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B8001F] transition-colors"
                >
                  www.anpc.ro
                </a>
              </li>
              <li>Tel: 021 9551</li>
            </ul>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <a
                href="https://anpc.ro/ce-este-sal/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ANPC - Soluționare Alternativă a Litigiilor"
                className="inline-block overflow-hidden rounded-md bg-white p-1 transition-transform hover:scale-105"
              >
                <img
                  src="/anpc-sal.png"
                  alt="ANPC SAL"
                  className="h-8 w-auto"
                />
              </a>
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ANPC - Soluționare Online a Litigiilor"
                className="inline-block overflow-hidden rounded-md bg-white p-1 transition-transform hover:scale-105"
              >
                <img
                  src="/anpc-sol.png"
                  alt="ANPC SOL"
                  className="h-8 w-auto"
                />
              </a>
            </div>
          </motion.div>

          {/* Legal & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h3 className="text-lg font-bold mb-4 font-[family-name:var(--font-unbounded)]">
              Legal
            </h3>
            <ul className="space-y-2 mb-6 text-sm">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#A0A0A0] hover:text-[#B8001F] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-bold mb-4 font-[family-name:var(--font-unbounded)]">
              Urmărește-ne
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-[#1A1A1A] hover:bg-[#B8001F] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#2A2A2A] to-transparent mb-8" />

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-[#666666] text-sm"
        >
          <p>
            © {new Date().getFullYear()} Asociația Club Sportiv Fiteducation.
            Toate drepturile rezervate.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
