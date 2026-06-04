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
    <div className="sticky top-0 z-30 bg-[#FAFAFA]/85 backdrop-blur">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8 lg:px-16">
        <nav
          className="trainers-scroll flex justify-start sm:justify-center gap-1 overflow-x-auto py-3"
          style={{ scrollbarWidth: "none" }}
        >
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#0A0A0A] text-white"
                    : "text-[#666] hover:bg-[#EFEFEF] hover:text-[#0A0A0A]"
                }`}
              >
                {s.label}
              </a>
            );
          })}
        </nav>
      </div>
      <div className="h-px bg-[#EAEAEA]" />
    </div>
  );
}
