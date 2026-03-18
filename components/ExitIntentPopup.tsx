"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";

export default function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");

    console.log("Broșură request:", { email });
    // TODO: Implement actual form submission
    alert("Mulțumim! Broșura va fi trimisă pe email în câteva momente.");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-[#1A1A1A] rounded-2xl max-w-md w-full p-8 relative shadow-2xl border border-[#2A2A2A]"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
                aria-label="Close"
              >
                <X size={20} className="text-[#A0A0A0]" />
              </button>

              {/* Content */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#B8001F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download size={32} className="text-[#B8001F]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-space-grotesk)]">
                  Descarcă broșura gratuită
                </h3>
                <p className="text-[#A0A0A0]">
                  Află tot ce trebuie să știi despre cursurile noastre
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Adresa ta de email"
                    className="w-full px-4 py-4 bg-[#0A0A0A] border-2 border-[#2A2A2A] rounded-xl text-white placeholder-[#666666] focus:border-[#B8001F] focus:outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-[#B8001F] text-white rounded-xl font-semibold hover:bg-[#490207] transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Descarcă broșura
                </button>
              </form>

              <p className="text-xs text-[#666666] text-center mt-4">
                Nu spam. Doar informații utile despre cursuri.
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
