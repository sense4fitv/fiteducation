# Context

Lucrăm pe un site Next.js existent și live: https://www.fiteducationschool.com/
E o școală de fitness (Fiteducation) care vinde două tipuri de produse educaționale:
cursuri acreditate și workshop-uri. Frontend-ul (homepage, pagini de curs, echipă
de traineri, configurator de programă, FAQ) este deja construit în Next.js.

OBIECTIV: adăugăm un backend complet peste frontend-ul existent, folosind Supabase.
NU rescriem frontend-ul de la zero — pornim de la codebase-ul actual, îl refactorizăm
acolo unde e nevoie ca să consume date dinamice din Supabase în loc de conținut hardcodat.

Primul pas pe care îl vreau de la tine: explorează codebase-ul actual, apoi propune-mi
arhitectura (schema de bază de date + structura de foldere + planul de integrare) ÎNAINTE
să scrii cod de producție. Vreau să validăm planul împreună.

# Modelul de produs

Există DOUĂ tipuri de produs: `course` (curs acreditat) și `workshop`.
Ambele împart câmpuri comune: titlu, motto, descriere, preț, dată, oră, locație,
durată, limbă, condiții de înscriere, etc.

Folosim UN SINGUR tabel `products` cu un câmp `type` ('course' | 'workshop').
Diferența dintre cele două tipuri se reflectă la nivel de STRUCTURĂ DE PAGINĂ de produs
(layout/template diferit pe frontend), nu printr-un model de date separat.

Pentru conținutul structurat (programă, "ce vei învăța", structura pe zile/module la
workshop-uri): abordare HIBRIDĂ. Câmpurile cu valoare unică (titlu, preț, dată...) sunt
coloane normale. Conținutul listat și repetitiv (secțiuni de programă, module, zile) se
stochează ca JSONB cu o schemă predictibilă (ex: array de secțiuni, fiecare cu titlu +
listă de itemi). Workshop-urile pot avea structuri diferite (pe zile, sau "Part 1/2/3"),
deci JSONB ne dă flexibilitatea necesară fără tabele relaționale pentru fiecare modul.

# Entități principale (Supabase / Postgres)

- `products` — curs sau workshop. Coloane comune + JSONB pentru conținut structurat.
  Include logica de preț cu fereastră de reducere (vezi mai jos).
- `trainers` — formatori. O singură pagină generală de traineri pe frontend; la click
  pe un trainer se deschide un POP-UP cu info despre el (fără pagini individuale).
- `product_trainers` — relație many-to-many între products și trainers
  (un trainer poate fi la mai multe produse; un produs poate avea mai mulți traineri).
- `users` — prin Supabase Auth.
- `enrollments` — înscrieri/comenzi, legate de user + product. Conține statusul plății.
- documente cursanți — stocate în Supabase Storage, legate de user/enrollment.

# Funcționalități cheie

## Prețuri și fereastra de reducere
- Prețul standard rămâne FIX indiferent de metoda de plată (ex. 7900 RON).
- Diferențierea de preț e o PROMOȚIE LIMITATĂ ÎN TIMP: în primele X zile de la lansarea
  produsului, prețul e redus (ex. 7500 RON). După expirarea ferestrei, revine la standard.
- Fereastra (data de start + durata în zile, sau data de final) e configurabilă per produs
  din panoul de admin.
- Logica de "preț curent" se calculează în funcție de fereastra activă și trebuie să fie
  consistentă între afișare (frontend), sticky bar și checkout.

## Plată
- Două căi: (1) Stripe — checkout online pe site; (2) plată gestionată manual din admin
  (ordin bancar etc.) — adăugată/marcată manual de staff.
- `enrollments` ține statusul plății (ex: pending / paid_stripe / paid_manual / cancelled).

## Cont utilizator / portal cursant
- Înregistrare + login prin Supabase Auth.
- Upload de documente cerute la înscriere (CI, diplomă, adeverință medicală etc.) în
  Supabase Storage.
- Bifare OBLIGATORIE T&C + GDPR la înscriere.
- Semnare digitală a contractului — NICE TO HAVE / DE EVALUAT separat. Nu blochează MVP-ul;
  marcheaz-o ca extensie viitoare și lasă modelul de date pregătit pentru ea.

## Panou de administrare (admin dashboard)
- Construit de noi în cod (nu integrare cu CRM extern). Simplu la început, dar SCALABIL.
- Permite staff-ului să: creeze/editeze produse (curs + workshop) cu toate câmpurile
  (dată, oră, locație, preț, titlu, descriere, programă), să configureze fereastra de
  reducere, să vadă înscrierile și documentele încărcate, să marcheze plăți manuale.
- Acces protejat prin rol (admin).

## Sticky bar
- Apare pe TOATE paginile.
- Afișează prețul (cu mesaj de urgență de tip "profită acum") în perioada de reducere.

## Etichete informative
- Secțiune "Pentru cine este acest workshop?" — DOAR etichetă informativă pe pagina de
  produs (începători / instructori / antrenori / pasionați), nu filtru funcțional.

# Stack
- Next.js (codebase existent).
- Supabase: Postgres + Auth + Storage.
- Stripe pentru plăți online.
- Row Level Security pe tabelele Supabase (useri văd doar datele lor; adminii văd tot).

# Ce vreau de la tine ACUM (pasul 1)
1. Explorează codebase-ul existent și spune-mi cum e structurat (unde e conținutul
   hardcodat care trebuie făcut dinamic).
2. Propune schema de bază de date completă (tabele, coloane, tipuri, relații, schema
   JSONB pentru conținutul structurat).
3. Propune structura de foldere și planul de integrare Supabase peste frontend.
4. Identifică deciziile deschise sau riscurile (ex: cum tratăm produsele "Coming Soon",
   migrarea conținutului actual hardcodat în DB).

Nu scrie încă cod de producție. Validăm planul, apoi mergem pe implementare în pași.