# Prompt pentru Claude Code — Fiteducation School Website

## Context

Construiește un site Next.js (App Router) pentru **Fiteducation School** — o școală de fitness care vinde cursuri de specializare în domeniul fitness. Site-ul trebuie să fie o landing page single-page cu design premium fitness/education.

**DESIGN CONCEPT IMPORTANT — Light background cu secțiuni dark floating:**
Fundalul paginii este **alb / foarte deschis** (#FAFAFA sau #F5F5F5). Secțiunile principale (hero, configurator, traineri, CTA) sunt **containere dark** (#0A0A0A / #111111) cu **colțuri rotunjite mari** (rounded-2xl / rounded-3xl) și **margini laterale** (mx-4 pe mobile, mx-8 pe tablet, mx-16 pe desktop), astfel încât se văd ca niște carduri întunecate care "plutesc" pe fundalul deschis. Exact ca în referința vizuală Gymon — hero section-ul este un bloc negru cu border-radius, cu spațiu alb vizibil în jurul lui. Navbar-ul rămâne pe fundal deschis (alb), cu text și logo negru/dark.

## Tech Stack

- **Next.js 14+** cu App Router
- **TypeScript**
- **Tailwind CSS** pentru styling
- **Framer Motion** pentru animații
- **Swiper.js** pentru slider-ul din hero și scroll-ul orizontal la traineri
- Fonturi Google: **Poppins** (body text) — pentru headings folosește un font geometric bold similar cu Overused Grotesk (folosește **Space Grotesk 700** ca fallback disponibil pe Google Fonts, sau importă Overused Grotesk din CDN dacă e disponibil)

## Paletă de culori

- **Page background**: **#FAFAFA** (off-white, fundalul general al paginii)
- **Navbar**: background alb/transparent, text negru **#0A0A0A**, pe scroll devine alb cu blur
- **Dark sections** (hero, configurator, traineri, CTA): background **#0A0A0A** sau **#111111**, cu **border-radius: 24px** și **margini laterale** vizibile ca să se vadă fundalul deschis în jurul lor
- **Card backgrounds** (în interiorul secțiunilor dark): **#1A1A1A** cu border subtle **#2A2A2A**
- Text pe secțiuni dark: primar **#FFFFFF**, secundar **#A0A0A0**
- Text pe fundal deschis (dacă e cazul): **#0A0A0A** primar, **#666666** secundar
- Accent primar: **#B8001F** (roșu puternic)
- Accent secundar: **#490207** (roșu închis / burgundy)
- Accent pentru hover/glow: gradient de la **#B8001F** la **#490207**
- Butoane CTA: background **#B8001F**, hover **#490207**

## Structura paginii

### 1. Navbar (fixed top, pe fundal deschis)

- Logo: text "Fiteducation" (placeholder, va fi înlocuit cu logo SVG) — **culoare neagră**
- Meniu: Acasă, Specializări, Traineri, Contact — **text negru/dark**
- Buton CTA: "Înscrie-te" (accent #B8001F, rounded-full)
- Pe scroll, navbar-ul capătă un background alb solid cu blur/shadow subtil
- Mobile: hamburger menu cu animație slide-in

### 2. Hero Section — Slider cu cursuri

- **Container dark floating**: background #0A0A0A, **border-radius: 24px**, cu **margini laterale** (mx-4 sm:mx-8 lg:mx-16) ca să se vadă fundalul alb al paginii în jurul lui. Exact ca în referința Gymon.
- **Full-width slider** (Swiper.js) în interiorul containerului dark, cu 4 slide-uri
- Fiecare slide are:
  - Background imagine placeholder (gradient dark overlay peste imagine, folosește un gradient de la #0A0A0A/80% la transparent)
  - Titlu curs (heading mare, bold)
  - Scurtă descriere (1-2 rânduri)
  - Badge cu durata (ex: "12 săptămâni")
  - Buton "Descoperă cursul" (CTA accent)
- Autoplay cu progress bar pe fiecare slide
- Pagination dots personalizate (accent color)
- Cursuri placeholder:
  1. "Personal Trainer Certificat" — Devino antrenor personal certificat internațional — 16 săptămâni
  2. "Instructor Aerobic & Group Fitness" — Specializare completă în clase de grup — 12 săptămâni
  3. "Nutriție Sportivă" — Fundamentele nutriției pentru performanță — 8 săptămâni
  4. "Antrenament Funcțional" — Tehnici avansate de antrenament funcțional — 10 săptămâni

### 3. Configurator Specializări (secțiunea principală)

Aceasta este secțiunea cheie a site-ului. Este un configurator vizual cu 3 rânduri de carduri, structurat ca un arbore de selecție. Utilizatorul selectează câte o opțiune pe fiecare rând, iar prețul total se actualizează în timp real.

**Layout:**

```
           ┌─────────────┐
  Rând 1:  │  Foundation  │               (1 card, centrat, mereu selectat)
           └─────────────┘
          ┌────────┐  ┌────────┐
  Rând 2: │   PT   │  │Aerobic │          (2 carduri, selectezi unul)
          └────────┘  └────────┘
    ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
R3: │Spec 1│ │Spec 2│ │Spec 3│ │Spec 4│  (4 carduri, selectezi unul)
    └──────┘ └──────┘ └──────┘ └──────┘
```

- **Rând 1 — Foundation** (1 card, centrat, lățime mai mare):
  - Titlu: "Foundation"
  - Descriere: "Bazele științei mișcării, anatomie funcțională și principii de antrenament"
  - Durată: "6 săptămâni"
  - Preț: "1.500 RON"
  - Mereu selectat (bază obligatorie), border accent, subtle glow

- **Rând 2 — Direcția principală** (2 carduri):
  - Card 1: "Personal Training" — "Specializare în antrenament individual și program design" — 8 săptămâni — 2.200 RON
  - Card 2: "Aerobic & Group Fitness" — "Specializare în clase de grup, coregrafie și motivație" — 8 săptămâni — 2.000 RON
  - Click pe un card = selectat (border accent + glow), celălalt devine deselected

- **Rând 3 — Specializare finală** (4 carduri):
  - Card 1: "Strength & Conditioning" — "Forță, putere și periodizare avansată" — 6 săpt — 1.800 RON
  - Card 2: "Nutriție Sportivă" — "Planuri nutriționale și suplimentare" — 6 săpt — 1.600 RON
  - Card 3: "Antrenament Funcțional" — "Mobilitate, stabilitate și mișcare funcțională" — 6 săpt — 1.700 RON
  - Card 4: "Recuperare & Stretching" — "Tehnici de recuperare și flexibilitate" — 6 săpt — 1.500 RON
  - Click pe un card = selectat, restul deselected

- **Summary bar** (sticky bottom sau inline, sub rânduri):
  - Afișează selecțiile curente: "Foundation + [Rând 2] + [Rând 3]"
  - **Preț total** (suma prețurilor individuale), animat la schimbare
  - Buton "Înscrie-te acum" (CTA mare, accent)

- **Design carduri:**
  - Background: #141414 cu border #1F1F1F
  - Selected: border #B8001F, box-shadow glow subtle roșu, background ușor mai deschis
  - Hover: scale ușor (1.02), border se luminează
  - Pe fiecare card: icon placeholder (emoji sau Lucide icon), titlu bold, descriere, durată (badge), preț (text mare, accent color)
  - Tranziție smoothă la selecție/deselecție

- Între rânduri, adaugă linii vizuale (connector lines) sau săgeți subtile care arată flow-ul de sus în jos, ca un path/parcurs educațional.

### 4. Secțiunea Traineri (scroll orizontal)

- Heading: "Echipa noastră de traineri"
- Subheading: "Profesioniști cu experiență în fitness și educație"
- **Scroll orizontal** (Swiper.js sau CSS scroll-snap) cu carduri de traineri
- 6 carduri placeholder:
  1. Alexandru Popescu — Strength & Conditioning
  2. Maria Ionescu — Aerobic & Group Fitness
  3. Andrei Dumitrescu — Personal Training
  4. Elena Vasilescu — Nutriție Sportivă
  5. Cristian Marinescu — Antrenament Funcțional
  6. Diana Georgescu — Recuperare & Stretching
- Fiecare card:
  - Imagine placeholder (div gradient sau imagine de pe Unsplash random)
  - Nume (bold)
  - Specializare (text secundar)
  - Hover: ușoară elevare, overlay subtil
- Pe desktop: 4 carduri vizibile, scroll cu butoane săgeți
- Pe mobile: 1.2 carduri vizibile (peek effect)

### 5. CTA Section — Înscrie-te

- Background: gradient de la #490207 la #0A0A0A (diagonal)
- Heading mare: "Începe-ți cariera în fitness"
- Subheading: "Locurile sunt limitate. Înscrie-te acum pentru următoarea sesiune."
- **Formular inline** (într-un card cu backdrop blur):
  - Nume (input)
  - Email (input)
  - Telefon (input)
  - Dropdown: "Ce specializare te interesează?" (opțiunile din configurator)
  - Buton "Trimite cererea" (CTA accent, full-width)
- Statistici sub formular (similar pozei 3):
  - "500+" — Absolvenți certificați
  - "15+" — Traineri experți
  - "50+" — Parteneriate active
  - "8+" — Ani de experiență

### 6. Footer

- Logo + descriere scurtă
- Links: Specializări, Traineri, Contact, Termeni & Condiții, Politica de confidențialitate
- Social media icons (Instagram, Facebook, LinkedIn, TikTok)
- Copyright "© 2026 Fiteducation School. Toate drepturile rezervate."

## Cerințe tehnice

- **Responsive**: Mobile-first, breakpoints la sm/md/lg/xl
- **Animații**: Fade-in on scroll (Framer Motion, IntersectionObserver), staggered reveals pe carduri, smooth transitions pe configurator
- **Performance**: Lazy load imagini, optimizări Next.js Image unde e posibil
- **Accesibilitate**: Semantic HTML, focus states vizibile, contrast bun
- **SEO**: Meta tags, Open Graph, title descriptiv
- Toate textele sunt în **limba română**
- Componente separate pentru fiecare secțiune
- State management pentru configurator cu React useState/useReducer

## Structura fișierelor sugerată (fără src/ folder)

```
app/
├── layout.tsx          (fonturi, metadata)
├── page.tsx            (compune secțiunile)
└── globals.css         (CSS variables, Tailwind)
components/
├── Navbar.tsx
├── HeroSlider.tsx
├── Configurator.tsx    (secțiunea principală)
├── ConfiguratorCard.tsx
├── ConfiguratorSummary.tsx
├── TrainersSection.tsx
├── TrainerCard.tsx
├── CTASection.tsx
└── Footer.tsx
data/
├── courses.ts          (datele cursurilor din slider)
├── specializations.ts  (datele configuratorului)
└── trainers.ts         (datele trainerilor)
lib/
└── utils.ts
```

## Referință vizuală

Stilul general urmează estetica din pozele atașate:

- **IMPORTANT: Fundal pagină DESCHIS** (#FAFAFA), cu secțiuni dark (#0A0A0A) care au **colțuri rotunjite mari** și **margini laterale**, creând efectul de "carduri dark floating pe fundal alb" — exact ca în poza 1 (Gymon hero)
- Navbar pe fundal alb/deschis, cu text negru
- Secțiunile dark au interior cu carduri mai deschise (#1A1A1A), border subtil
- Accent color (#B8001F) pentru elemente interactive și selecții
- Spațiere generoasă între secțiuni (gap vertical mare între containerele dark)
- Imagini cu overlay gradient întunecat
- Statistici mari, bold, cu accent color pe numere

## IMPORTANT

- Toate datele (cursuri, specializări, traineri, prețuri) sunt **placeholder** — vor fi înlocuite ulterior
- Logo-ul va fi adăugat ulterior ca SVG — folosește text placeholder deocamdată
- Imaginile sunt placeholder — folosește div-uri cu gradient sau imagini generice de pe Unsplash
- Focusul principal este pe **configuratorul de specializări** — acesta trebuie să fie funcțional, vizual clar și ușor de înțeles
- Asigură-te că prețul total se calculează corect și se animează la schimbare
