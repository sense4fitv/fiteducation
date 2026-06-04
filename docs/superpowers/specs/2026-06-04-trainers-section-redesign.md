# Trainers Section Redesign — Expanding Panels

**Date:** 2026-06-04
**Status:** Approved

## Overview

Replace the current generic dark-card Swiper carousel with an expanding panels layout that gives each trainer cinematic visual presence and a distinctive interaction pattern.

## Design

### Desktop (lg+)

Six tall vertical panels arranged side by side inside a dark container (`#0A0A0A`), filling the full section width. All panels visible at all times.

- **Default state:** First panel expanded, others collapsed.
- **Collapsed panel:** Shows trainer portrait as background with a gradient overlay. Trainer name displayed vertically (rotated text) at the bottom.
- **Expanded panel:** Takes ~3.5x the width of a collapsed panel via Framer Motion `layout` animation. Shows:
  - Specialty tags (pill badges, e.g. "Fondator", "Nutriție") — red-tinted with `rgba(184,0,31,0.3)` background
  - Full name (large, bold)
  - Credentials line (uppercase, `#B8001F`)
  - Bio paragraph (gray, 2-3 lines)
  - Social links (circular icon buttons for Instagram, Facebook, LinkedIn)
- **Interaction:** Hovering a collapsed panel expands it and collapses the previously active one. Content inside fades in with staggered Framer Motion animations.

### Mobile (<lg)

Horizontal scroll with tall portrait cards (min-width ~260px, height ~340px).

- Each card shows the full profile: tags, name, credentials, bio, social links overlaid on the portrait with a gradient.
- Scroll indicator dots below the cards.
- Cards are swipeable (CSS `overflow-x: auto` with `snap-x`).

### Section Header

Centered above the panels:
- Subtitle: "ECHIPA NOASTRĂ" — small, uppercase, letter-spaced, `#B8001F`
- Title: "Traineri de elită" — large, bold, white

### Animation Details (Framer Motion)

- **Panel expand/collapse:** `layout` prop on each panel container. Panel width animated via `animate={{ flex: isActive ? 3.5 : 1 }}` with spring transition (`type: "spring", stiffness: 300, damping: 30`).
- **Content reveal (expanded panel):** `AnimatePresence` wrapping the expanded content. Staggered fade-in: tags → name → credentials → bio → social links, with ~0.05s delay between each.
- **Content hide (collapsing panel):** Quick fade-out (`duration: 0.15`) before panel contracts.
- **Section entrance:** `whileInView` fade-up on the container, same as current.
- **Collapsed name:** Always visible, no animation needed beyond the panel resize.

## Data Model Changes

Extend the `Trainer` interface in `data/trainers.ts`:

```typescript
export interface Trainer {
  id: number;
  name: string;
  description: string;    // short credentials line (existing)
  image: string;           // existing
  bio: string;             // NEW — 2-3 sentence paragraph
  tags: string[];          // NEW — specialty tags
  socialLinks?: {          // NEW — optional social URLs
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
}
```

Populate all 6 existing trainers with placeholder bio text and reasonable tags derived from their current descriptions.

## Components

### `TrainersSection.tsx` (rewrite)
- Section container with header
- Desktop: flex row of `TrainerPanel` components, manages `activeIndex` state
- Mobile: horizontal scroll container with `TrainerMobileCard` components
- Responsive switch at `lg` breakpoint (1024px)

### `TrainerPanel.tsx` (new, replaces TrainerCard.tsx)
- Single panel for desktop view
- Props: `trainer`, `isActive`, `onActivate`
- Uses Framer Motion `motion.div` with `layout` and `animate` for flex transitions
- Collapsed: portrait background + vertical name
- Expanded: `AnimatePresence` content block with staggered children

### `TrainerMobileCard.tsx` (new)
- Card for mobile horizontal scroll
- Full profile always visible (no expand/collapse)
- Portrait background with gradient overlay, content at bottom

### Cleanup
- Delete `TrainerCard.tsx` (replaced by `TrainerPanel.tsx` and `TrainerMobileCard.tsx`)

## Styling

- Container: `bg-[#0A0A0A] rounded-3xl` (same as current)
- Panels height: `h-[500px]` on desktop
- Tags: `bg-[rgba(184,0,31,0.3)] border border-[rgba(184,0,31,0.5)] text-[#ff6b7a]` rounded pills
- Social buttons: `bg-white/10` circles, `hover:bg-white/20`
- Gradient overlays on portraits: `bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent`
- Vertical text on collapsed panels: `writing-mode: vertical-rl`, rotated 180deg
- Mobile cards: `min-w-[260px] h-[340px]`, `scroll-snap-align: start`
- Mobile scroll container: `overflow-x-auto scroll-snap-x-mandatory`

## Scope Boundaries

- This spec covers ONLY the trainers section visual redesign
- Data stays hardcoded (Supabase migration is Phase 2)
- No routing/linking to individual trainer pages
- No changes to other homepage sections
