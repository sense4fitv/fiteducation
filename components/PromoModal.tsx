"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Clock } from "lucide-react";
import Link from "next/link";

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate countdown to end of day (March 21, 2026)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date(2026, 2, 21, 23, 59, 59); // March 21, 2026 23:59:59
      const difference = endOfDay.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Show modal after 3 seconds
  useEffect(() => {
    if (hasShown) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasShown(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasShown]);

  const handleClose = () => {
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
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] rounded-2xl max-w-lg w-full relative shadow-2xl border border-[#B8001F]/30"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors z-10"
                aria-label="Close"
              >
                <X size={20} className="text-[#A0A0A0]" />
              </button>

              {/* Countdown Banner */}
              <div className="bg-gradient-to-r from-[#B8001F] to-[#E6002A] px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock size={20} className="text-white" />
                  <p className="text-white font-semibold text-sm uppercase tracking-wider">
                    Oferta expiră în
                  </p>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 min-w-[70px]">
                      <p className="text-3xl font-bold text-white font-[family-name:var(--font-unbounded)]">
                        {String(timeLeft.hours).padStart(2, "0")}
                      </p>
                      <p className="text-xs text-white/80">ORE</p>
                    </div>
                  </div>
                  <span className="text-3xl text-white font-bold">:</span>
                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 min-w-[70px]">
                      <p className="text-3xl font-bold text-white font-[family-name:var(--font-unbounded)]">
                        {String(timeLeft.minutes).padStart(2, "0")}
                      </p>
                      <p className="text-xs text-white/80">MIN</p>
                    </div>
                  </div>
                  <span className="text-3xl text-white font-bold">:</span>
                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 min-w-[70px]">
                      <p className="text-3xl font-bold text-white font-[family-name:var(--font-unbounded)]">
                        {String(timeLeft.seconds).padStart(2, "0")}
                      </p>
                      <p className="text-xs text-white/80">SEC</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold text-white mb-3 font-[family-name:var(--font-unbounded)]">
                    Ofertă Exclusivă!
                  </h3>
                  <p className="text-lg text-white mb-2">
                    <span className="font-bold text-[#B8001F]">Doar astăzi</span> - Certificarea de
                  </p>
                  <p className="text-xl font-bold text-white mb-4">
                    Personal Trainer
                  </p>
                  <div className="inline-block bg-[#B8001F]/10 border-2 border-[#B8001F] rounded-xl px-6 py-3 mb-4">
                    <p className="text-sm text-[#A0A0A0] line-through mb-1">7900 LEI</p>
                    <p className="text-4xl font-bold text-[#B8001F] font-[family-name:var(--font-unbounded)]">
                      -600 LEI
                    </p>
                  </div>
                  <p className="text-[#A0A0A0] mb-2">
                    Folosește codul
                  </p>
                  <div className="inline-block bg-[#0A0A0A] border-2 border-dashed border-[#B8001F] rounded-lg px-6 py-3 mb-4">
                    <p className="text-2xl font-bold text-[#B8001F] font-mono tracking-wider">
                      ARENA21
                    </p>
                  </div>
                </div>

                {/* Klarna Info */}
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <CreditCard size={24} className="text-[#B8001F] flex-shrink-0" />
                    <p className="text-sm text-[#A0A0A0]">
                      <span className="text-white font-semibold">Plată în rate</span> cu Klarna disponibilă
                    </p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <a
                    href="https://checkout.sense4fitsummit.com/pages/index_beta?spid=prod_UBjZWMpQiKFT1k"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-4 bg-[#B8001F] text-white rounded-xl font-semibold hover:bg-[#490207] transition-all transform hover:scale-[1.02] text-center shadow-lg shadow-[#B8001F]/20"
                  >
                    Cumpără acum
                  </a>
                  <Link
                    href="/curs/personal-training-certificat"
                    onClick={handleClose}
                    className="block w-full px-6 py-4 border-2 border-[#2A2A2A] text-white rounded-xl font-semibold hover:bg-[#2A2A2A] transition-colors text-center"
                  >
                    Mai multe detalii
                  </Link>
                </div>

                <p className="text-xs text-[#666666] text-center mt-4">
                  Oferta validă doar astăzi, 21 Martie 2026
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
