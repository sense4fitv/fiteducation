# Trainers Section Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Swiper carousel trainers section with expanding vertical panels (desktop) and horizontal scroll cards (mobile), showcasing each trainer with rich profiles.

**Architecture:** Three new/rewritten components — `TrainersSection` (orchestrator with responsive switch), `TrainerPanel` (desktop expanding panel), `TrainerMobileCard` (mobile scroll card). Extended trainer data model with bio, tags, and social links. Framer Motion `layout` + `AnimatePresence` for all animations.

**Tech Stack:** Next.js 16, React, Framer Motion 12, Lucide React, Tailwind CSS 3

---

### File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Modify | `data/trainers.ts` | Extend `Trainer` interface, add bio/tags/socialLinks to all entries |
| Create | `components/TrainerPanel.tsx` | Desktop expanding panel with Framer Motion layout animations |
| Create | `components/TrainerMobileCard.tsx` | Mobile horizontal scroll card with full profile |
| Rewrite | `components/TrainersSection.tsx` | Section container, responsive switch, active panel state |
| Delete | `components/TrainerCard.tsx` | Replaced by TrainerPanel + TrainerMobileCard |

---

### Task 1: Extend Trainer Data Model

**Files:**
- Modify: `data/trainers.ts`

- [ ] **Step 1: Update the Trainer interface and all trainer entries**

```typescript
export interface Trainer {
  id: number;
  name: string;
  description: string;
  image: string;
  bio: string;
  tags: string[];
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
}

export const trainers: Trainer[] = [
  {
    id: 1,
    name: "Flavius Turcanu",
    description: "Doctorand IEFS, Fondator Fiteducation & CRAB, Presenter internațional, Consultant",
    image: "/trainers/flavius.png",
    bio: "Cu o experiență de peste 15 ani în industria fitness, Flavius este fondatorul Fiteducation și CRAB. Presenter internațional și consultant pentru branduri de top, el aduce o viziune inovatoare în educația fitness din România.",
    tags: ["Fondator", "Consulting", "Presenter"],
    socialLinks: {
      instagram: "https://instagram.com/flavius.turcanu",
      facebook: "https://facebook.com/flavius.turcanu",
      linkedin: "https://linkedin.com/in/flavius-turcanu",
    },
  },
  {
    id: 2,
    name: "Bianca Margarit",
    description: "Doctor, Nutriționist, Personal trainer",
    image: "/trainers/bianca.png",
    bio: "Bianca combină expertiza medicală cu pasiunea pentru nutriție și fitness. Ca doctor și nutriționist certificat, oferă o perspectivă științifică asupra antrenamentului și alimentației sănătoase.",
    tags: ["Nutriție", "Medicină", "Personal Training"],
    socialLinks: {
      instagram: "https://instagram.com/bianca.margarit",
    },
  },
  {
    id: 3,
    name: "Attila Kovacs",
    description: "Doctorand, specialist în respirație, coach de performanță certificat",
    image: "/trainers/attila.png",
    bio: "Attila este un specialist în tehnici de respirație și coaching de performanță. Ca doctorand, îmbină cercetarea academică cu aplicații practice pentru optimizarea performanței sportive.",
    tags: ["Respirație", "Performanță", "Cercetare"],
    socialLinks: {
      instagram: "https://instagram.com/attila.kovacs",
      linkedin: "https://linkedin.com/in/attila-kovacs",
    },
  },
  {
    id: 4,
    name: "Robert Florea",
    description: "Specialist în kinetoterapie, bodybuilding, recuperare, nutriție, condiționare tactică și master trainer ISSA",
    image: "/trainers/robert.png",
    bio: "Robert aduce o expertiză vastă în kinetoterapie, bodybuilding și recuperare. Ca master trainer ISSA, el este specializat în condiționare tactică și programe de nutriție personalizate.",
    tags: ["Kinetoterapie", "Bodybuilding", "ISSA Master"],
    socialLinks: {
      instagram: "https://instagram.com/robert.florea",
      facebook: "https://facebook.com/robert.florea",
    },
  },
  {
    id: 5,
    name: "Ana Georgescu",
    description: "Specialist în educație, Presenter internațional, Master trainer",
    image: "/trainers/ana.png",
    bio: "Ana este un master trainer cu experiență internațională în prezentări și educație fitness. Specializată în metodologii moderne de predare, ea formează noua generație de profesioniști în fitness.",
    tags: ["Educație", "Presenter", "Master Trainer"],
    socialLinks: {
      instagram: "https://instagram.com/ana.georgescu",
    },
  },
  {
    id: 6,
    name: "Antonio Enache",
    description: "Fondator Sense4fit, expert în domeniul wellness, în comunicare și business",
    image: "/trainers/antonio.png",
    bio: "Antonio este fondatorul Sense4fit și un expert recunoscut în wellness, comunicare și business. El ajută profesioniștii din fitness să-și dezvolte abilitățile de business și comunicare.",
    tags: ["Wellness", "Business", "Comunicare"],
    socialLinks: {
      instagram: "https://instagram.com/antonio.enache",
      facebook: "https://facebook.com/antonio.enache",
      linkedin: "https://linkedin.com/in/antonio-enache",
    },
  },
];
```

- [ ] **Step 2: Verify the app still compiles**

Run: `npx next build --no-lint 2>&1 | tail -5`
Expected: Build succeeds (the new fields are additive, no breaking changes to `app/curs/[id]/page.tsx`)

- [ ] **Step 3: Commit**

```bash
git add data/trainers.ts
git commit -m "feat: extend trainer data with bio, tags, and social links"
```

---

### Task 2: Create TrainerPanel Component (Desktop)

**Files:**
- Create: `components/TrainerPanel.tsx`

- [ ] **Step 1: Create the TrainerPanel component**

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import type { Trainer } from "@/data/trainers";

interface TrainerPanelProps {
  trainer: Trainer;
  isActive: boolean;
  onActivate: () => void;
}

const contentVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export default function TrainerPanel({
  trainer,
  isActive,
  onActivate,
}: TrainerPanelProps) {
  return (
    <motion.div
      layout
      animate={{ flex: isActive ? 3.5 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseEnter={onActivate}
      className="relative h-[500px] rounded-2xl overflow-hidden cursor-pointer"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${trainer.image})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />

      {/* Collapsed State — Vertical Name */}
      {!isActive && (
        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center">
          <span
            className="text-white text-xs font-bold tracking-widest uppercase"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            {trainer.name.split(" ")[0]} {trainer.name.split(" ")[1]?.[0]}.
          </span>
        </div>
      )}

      {/* Expanded State — Full Content */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute bottom-0 left-0 right-0 p-6"
          >
            {/* Tags */}
            <motion.div
              custom={0}
              variants={contentVariants}
              className="flex flex-wrap gap-2 mb-3"
            >
              {trainer.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[rgba(184,0,31,0.3)] border border-[rgba(184,0,31,0.5)] text-[#ff6b7a] text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wide font-medium"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* Name */}
            <motion.h3
              custom={1}
              variants={contentVariants}
              className="text-xl font-extrabold text-white tracking-tight"
            >
              {trainer.name}
            </motion.h3>

            {/* Credentials */}
            <motion.p
              custom={2}
              variants={contentVariants}
              className="text-[#B8001F] text-xs font-semibold uppercase tracking-wider mt-1"
            >
              {trainer.description}
            </motion.p>

            {/* Bio */}
            <motion.p
              custom={3}
              variants={contentVariants}
              className="text-[#999] text-sm leading-relaxed mt-3 max-w-[320px]"
            >
              {trainer.bio}
            </motion.p>

            {/* Social Links */}
            {trainer.socialLinks && (
              <motion.div
                custom={4}
                variants={contentVariants}
                className="flex gap-3 mt-4"
              >
                {trainer.socialLinks.instagram && (
                  <a
                    href={trainer.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#aaa] hover:text-white transition-colors"
                  >
                    <Instagram size={14} />
                  </a>
                )}
                {trainer.socialLinks.facebook && (
                  <a
                    href={trainer.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#aaa] hover:text-white transition-colors"
                  >
                    <Facebook size={14} />
                  </a>
                )}
                {trainer.socialLinks.linkedin && (
                  <a
                    href={trainer.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#aaa] hover:text-white transition-colors"
                  >
                    <Linkedin size={14} />
                  </a>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx next build --no-lint 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add components/TrainerPanel.tsx
git commit -m "feat: add TrainerPanel component for desktop expanding panels"
```

---

### Task 3: Create TrainerMobileCard Component

**Files:**
- Create: `components/TrainerMobileCard.tsx`

- [ ] **Step 1: Create the TrainerMobileCard component**

```tsx
"use client";

import { motion } from "framer-motion";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import type { Trainer } from "@/data/trainers";

interface TrainerMobileCardProps {
  trainer: Trainer;
  index: number;
}

export default function TrainerMobileCard({
  trainer,
  index,
}: TrainerMobileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="min-w-[260px] h-[340px] rounded-2xl overflow-hidden relative flex-shrink-0 scroll-snap-align-start"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${trainer.image})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {trainer.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[rgba(184,0,31,0.3)] border border-[rgba(184,0,31,0.5)] text-[#ff6b7a] text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wide font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Name */}
        <h3 className="text-lg font-extrabold text-white">{trainer.name}</h3>

        {/* Credentials */}
        <p className="text-[#B8001F] text-[10px] font-semibold uppercase tracking-wider mt-1">
          {trainer.description}
        </p>

        {/* Bio */}
        <p className="text-[#999] text-[10px] leading-relaxed mt-2 line-clamp-3">
          {trainer.bio}
        </p>

        {/* Social Links */}
        {trainer.socialLinks && (
          <div className="flex gap-2 mt-3">
            {trainer.socialLinks.instagram && (
              <a
                href={trainer.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#aaa]"
              >
                <Instagram size={12} />
              </a>
            )}
            {trainer.socialLinks.facebook && (
              <a
                href={trainer.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#aaa]"
              >
                <Facebook size={12} />
              </a>
            )}
            {trainer.socialLinks.linkedin && (
              <a
                href={trainer.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#aaa]"
              >
                <Linkedin size={12} />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx next build --no-lint 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add components/TrainerMobileCard.tsx
git commit -m "feat: add TrainerMobileCard component for mobile horizontal scroll"
```

---

### Task 4: Rewrite TrainersSection and Delete TrainerCard

**Files:**
- Rewrite: `components/TrainersSection.tsx`
- Delete: `components/TrainerCard.tsx`

- [ ] **Step 1: Rewrite TrainersSection.tsx**

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { trainers } from "@/data/trainers";
import TrainerPanel from "./TrainerPanel";
import TrainerMobileCard from "./TrainerMobileCard";

export default function TrainersSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = 260 + 12; // min-w + gap
      const index = Math.round(scrollLeft / cardWidth);
      setActiveDot(Math.min(index, trainers.length - 1));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="traineri" className="py-20 px-4 sm:px-8 lg:px-16">
      <div className="max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#0A0A0A] rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[#B8001F] text-xs uppercase tracking-[3px] font-semibold mb-3"
            >
              Echipa noastră
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-bold text-white font-[family-name:var(--font-space-grotesk)]"
            >
              Traineri de elită
            </motion.h2>
          </div>

          {/* Desktop: Expanding Panels */}
          <div className="hidden lg:flex gap-1.5">
            {trainers.map((trainer, index) => (
              <TrainerPanel
                key={trainer.id}
                trainer={trainer}
                isActive={activeIndex === index}
                onActivate={() => setActiveIndex(index)}
              />
            ))}
          </div>

          {/* Mobile: Horizontal Scroll */}
          <div className="lg:hidden">
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto pb-4"
              style={{
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
              }}
            >
              {trainers.map((trainer, index) => (
                <TrainerMobileCard
                  key={trainer.id}
                  trainer={trainer}
                  index={index}
                />
              ))}
            </div>

            {/* Scroll Indicator Dots */}
            <div className="flex justify-center gap-1.5 mt-4">
              {trainers.map((_, index) => (
                <div
                  key={index}
                  className={`h-[3px] rounded-full transition-all duration-300 ${
                    activeDot === index
                      ? "w-5 bg-[#B8001F]"
                      : "w-2 bg-[#333]"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Delete TrainerCard.tsx**

```bash
rm components/TrainerCard.tsx
```

- [ ] **Step 3: Hide mobile scrollbar with CSS**

Add to `app/globals.css` (at the end of the file, before the closing brace if in a layer, or at the bottom):

```css
/* Hide scrollbar for trainers mobile scroll */
.lg\:hidden [style*="scroll-snap-type"] {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.lg\:hidden [style*="scroll-snap-type"]::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 4: Verify the app compiles and renders**

Run: `npx next build --no-lint 2>&1 | tail -5`
Expected: Build succeeds with no errors

- [ ] **Step 5: Commit**

```bash
git add components/TrainersSection.tsx components/TrainerMobileCard.tsx components/TrainerPanel.tsx app/globals.css
git add -u components/TrainerCard.tsx
git commit -m "feat: replace trainer carousel with expanding panels layout

Rewrite TrainersSection with desktop expanding panels and mobile
horizontal scroll cards. Delete old TrainerCard component."
```

---

### Task 5: Visual QA and Polish

**Files:**
- Potentially tweak: `components/TrainerPanel.tsx`, `components/TrainerMobileCard.tsx`, `components/TrainersSection.tsx`

- [ ] **Step 1: Run dev server and visually inspect**

Run: `npm run dev`

Check the following in the browser:
1. Desktop (>1024px): All 6 panels visible, first one expanded by default. Hovering others expands them smoothly. Content fades in with stagger. Vertical names visible on collapsed panels.
2. Mobile (<1024px): Cards scroll horizontally with snap. Dots update on scroll. Full profile visible on each card.
3. Trainer images render correctly from `/trainers/*.png`.
4. Social links open in new tabs.
5. Section entrance animation triggers on scroll.

- [ ] **Step 2: Fix any visual issues found**

Common things to adjust:
- Panel height if images are cropped poorly
- Gradient opacity if text is hard to read
- Content padding if text overflows
- Spring stiffness/damping if animation feels too bouncy or too stiff

- [ ] **Step 3: Commit any polish changes**

```bash
git add -A
git commit -m "style: polish trainers expanding panels layout"
```
