"use client";

import { useEffect, useState } from "react";

type NavSection = { id: string; label: string };

export default function CourseSectionNav({
  sections,
}: {
  sections: NavSection[];
}) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
      );
      o.observe(el);
      observers.push(o);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  return (
    <div className="sticky top-0 z-30 border-y border-[#EAEAEA] bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-[1200px] gap-1 overflow-x-auto px-4 sm:px-8 lg:px-16">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`relative whitespace-nowrap px-3 py-3 text-sm font-medium transition-colors ${
              active === s.id
                ? "text-[#0A0A0A]"
                : "text-[#888] hover:text-[#0A0A0A]"
            }`}
          >
            {s.label}
            {active === s.id ? (
              <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[#B8001F]" />
            ) : null}
          </a>
        ))}
      </nav>
    </div>
  );
}
