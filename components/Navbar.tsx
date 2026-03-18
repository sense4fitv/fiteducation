"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Acasă", href: "#" },
    { label: "Specializări", href: "#specializari" },
    { label: "Traineri", href: "#traineri" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{
        backgroundColor: isScrolled
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(255, 255, 255, 0)",
        backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
        borderBottomLeftRadius: isScrolled ? "24px" : "0px",
        borderBottomRightRadius: isScrolled ? "24px" : "0px",
        boxShadow: isScrolled
          ? "0 4px 20px rgba(0, 0, 0, 0.08)"
          : "0 0 0 rgba(0, 0, 0, 0)",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 lg:px-16"
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <img
              src="/LogoFiteducation.svg"
              alt="Fiteducation"
              className="h-8 w-auto"
            />
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[#0A0A0A] hover:text-[#B8001F] transition-colors duration-200 font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#B8001F] text-white rounded-full font-semibold hover:bg-[#490207] transition-all duration-300 hover:scale-105"
            >
              Înscrie-te
            </a>
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
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full px-6 py-3 bg-[#B8001F] text-white text-center rounded-full font-semibold hover:bg-[#490207] transition-colors"
              >
                Înscrie-te
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
