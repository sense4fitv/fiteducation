"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: "Acasă", href: "/" },
    { label: "Cursuri", href: "/#specializari" },
    { label: "Traineri", href: "/#traineri" },
    { label: "Contact", href: "/#contact" },
  ];

  const leftItems = menuItems.slice(0, 2);
  const rightItems = menuItems.slice(2);

  const navLinkClass =
    "relative text-[#0A0A0A] hover:text-[#B8001F] transition-colors duration-200 font-medium after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-[#B8001F] after:transition-[width] after:duration-300 hover:after:w-full";

  return (
    <nav
      className="relative z-50 px-4 sm:px-8 lg:px-16"
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between md:justify-center h-20 md:gap-10 lg:gap-14">
          {/* Mobile logo (left) */}
          <a href="/" className="flex items-center md:hidden">
            <img
              src="/LogoFiteducation.svg"
              alt="Fiteducation"
              className="h-8 w-auto"
            />
          </a>

          {/* Desktop: left links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {leftItems.map((item) => (
              <a key={item.label} href={item.href} className={navLinkClass}>
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop: centered logo */}
          <a href="/" className="hidden md:flex items-center shrink-0">
            <img
              src="/LogoFiteducation.svg"
              alt="Fiteducation"
              className="h-9 lg:h-10 w-auto"
            />
          </a>

          {/* Desktop: right links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {rightItems.map((item) => (
              <a key={item.label} href={item.href} className={navLinkClass}>
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#0A0A0A] hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-lg rounded-b-3xl shadow-lg"
          >
            <div className="px-4 py-6 space-y-4">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-[#0A0A0A] hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full px-6 py-3 bg-[#B8001F] text-white text-center rounded-full font-semibold hover:bg-[#490207] transition-colors"
              >
                Înscrie-te
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
