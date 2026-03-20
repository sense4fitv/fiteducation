"use client";

import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

export default function Footer() {
  const links = {
    legal: [
      { label: "Termeni & Condiții", href: "#" },
      { label: "Politica de confidențialitate", href: "#" },
    ],
    social: [
      { icon: Instagram, href: "https://www.instagram.com/fiteducationschool?igsh=MXBrOXgzNDJrY2E3bw==", label: "Instagram" },
    ],
  };

  return (
    <footer className="bg-[#0A0A0A] text-white py-16 px-4 sm:px-8 lg:px-16">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="/LogoFiteducation.svg"
              alt="Fiteducation"
              className="h-10 w-auto mb-4"
            />
            <p className="text-[#A0A0A0] leading-relaxed max-w-md">
              Transformăm pasiunea pentru fitness în cariere de succes. Alătură-te
              comunității noastre și devino un profesionist certificat în
              industria fitness.
            </p>
          </motion.div>

          {/* Legal & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold mb-4 font-[family-name:var(--font-space-grotesk)]">
              Legal
            </h3>
            <ul className="space-y-2 mb-6">
              {links.legal.map((link) => (
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

            {/* Social Media */}
            <h3 className="text-lg font-bold mb-4 font-[family-name:var(--font-space-grotesk)]">
              Urmărește-ne
            </h3>
            <div className="flex gap-4">
              {links.social.map((social) => {
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
            © {new Date().getFullYear()} Fiteducation School. Toate drepturile
            rezervate.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
