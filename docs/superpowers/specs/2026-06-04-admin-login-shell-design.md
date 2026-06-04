# Admin Login & Dashboard Shell — Design

**Date:** 2026-06-04
**Scope:** First slice of the admin CMS rebuild — login flow, route protection, sidebar shell, placeholder dashboard, and "coming soon" stubs for the remaining sections.

## Goal

Stand up the admin surface at `/admin` so an authorized user (`admin@fiteducationschool.com`) can sign in, land on a protected dashboard, and see a sidebar listing all upcoming sections. Subsequent slices will fill in Trainers, Products, and Enrollments CRUD.

## Non-goals

- Trainers / Products / Enrollments CRUD (stubbed only).
- Real dashboard statistics (placeholder welcome card only).
- Password reset, MFA, account self-service.
- Public sign-up — admin accounts are provisioned in Supabase Studio.

## Architecture

### Route layout

```
app/
  (admin-public)/
    admin/
      login/page.tsx                 ← public login form
  admin/
    layout.tsx                       ← gated layout (session + is_admin check)
    page.tsx                         ← Dashboard (welcome card)
    products/page.tsx                ← ComingSoon stub
    trainers/page.tsx                ← ComingSoon stub
    enrollments/page.tsx             ← ComingSoon stub
    actions.ts                       ← server actions: signInAdmin, signOutAdmin

components/
  admin/
    AdminShell.tsx                   ← SidebarProvider + main area + top bar
    AdminSidebar.tsx                 ← branded sidebar with nav + user footer
    ComingSoon.tsx                   ← shared placeholder for stub pages
    LoginForm.tsx                    ← client form used by login page

middleware.ts                        ← Supabase session-refresh middleware
```

The login route lives in a `(admin-public)` route group so it shares the URL `/admin/login` with the gated `/admin/*` segment but bypasses `app/admin/layout.tsx`. This avoids a redirect loop where the gate would otherwise try to protect its own login page.

### Auth & protection — two layers

**Layer 1 — `middleware.ts`**

Standard `@supabase/ssr` cookie-refresh middleware (verbatim from the official Supabase Next.js guide). Runs on every request matching `/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)`. Only responsibility: keep the Supabase auth cookies fresh. No redirects, no role checks.

**Layer 2 — `app/admin/layout.tsx`** (server component)

1. `const supabase = await createClient()`
2. `const { data: { user } } = await supabase.auth.getUser()` — if `!user`, `redirect("/admin/login")`.
3. `const { data: isAdmin } = await supabase.rpc("is_admin")` — if not true, `await supabase.auth.signOut()` then `redirect("/admin/login?error=unauthorized")`.
4. Otherwise render `<AdminShell user={user}>{children}</AdminShell>` and mount a `<Toaster richColors theme="dark" />` for admin-scoped toasts.

The login page reads `searchParams.error` and, if `unauthorized`, shows a sonner `toast.error("Cont neautorizat")` on mount.

### Auth flow

**Sign-in** (`app/admin/actions.ts → signInAdmin(formData)`)

```ts
"use server";

export async function signInAdmin(_prev, formData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email sau parolă incorectă" };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "Cont neautorizat" };
  }
  redirect("/admin");
}
```

The login form uses `useActionState` (React 19) to bind the action. On `{ error }` return, the client shows `toast.error(error)`. Success path triggers a server redirect — no client toast needed.

**Sign-out** (`signOutAdmin`)

Server action: `await supabase.auth.signOut(); redirect("/admin/login")`. Triggered from the sidebar footer dropdown.

## Component spec

### `LoginForm` (client)

- shadcn `Card` (max-w-sm) centered on `min-h-screen bg-section-dark`.
- `CardHeader`: small logo, title "FitEducation Admin", muted description "Conectează-te pentru a continua".
- `CardContent`: `<form action={formAction}>` with two `Input` fields (`email`, `password`) + matching `Label`s.
- `CardFooter`: full-width `Button` ("Conectare"), `disabled={isPending}`, showing a spinner when pending.
- On `state.error` change → `toast.error(state.error)`.

### `AdminShell` (client)

- Wraps children in `<SidebarProvider>`.
- Renders `<AdminSidebar user={user} />` and a `<SidebarInset>` containing:
  - Sticky top bar (`h-14 border-b border-zinc-800 px-4 flex items-center gap-3`): `<SidebarTrigger />` + a page title derived from the current route (Dashboard / Cursuri & Workshops / Traineri / Înscrieri).
  - Main content area: `flex-1 p-6 bg-section-dark` rendering `{children}`.

### `AdminSidebar` (client)

- shadcn `Sidebar` variant `inset`, `bg-zinc-950 border-zinc-800`.
- **Header**: logo image (40×40) + stacked text "FitEducation" / "Admin" (xs, muted).
- **Content**: one `SidebarGroup` labelled "Management" with four `SidebarMenuItem`s, each with a lucide icon:
  - `/admin` — `LayoutDashboard` — "Dashboard"
  - `/admin/products` — `Package` — "Cursuri & Workshops"
  - `/admin/trainers` — `Users` — "Traineri"
  - `/admin/enrollments` — `ClipboardList` — "Înscrieri"
- Active item determined by `usePathname()`; active style uses `accent-primary` (#B8001F) for left border + text.
- **Footer**: `DropdownMenu` triggered by a row showing an `Avatar` (initials from email) + truncated email + chevron. Menu has one item: "Deconectare" (icon `LogOut`) → `<form action={signOutAdmin}>` with a hidden submit button styled as a menu item.

### `ComingSoon` (server)

```tsx
<ComingSoon title="Cursuri & Workshops" icon={Package} />
```

Renders a centered `Card` with an icon in a tinted circle, the title, and the line "Această secțiune va fi disponibilă în curând."

### Dashboard page

Single `Card` with `CardHeader` ("Bun venit, {user.email}") + `CardContent` ("Panou administrare FitEducation. Funcționalitățile complete vor fi disponibile în curând.").

## Styling

- Dark mode throughout admin (independent of the marketing site's theme).
- Background: `bg-section-dark` (#0A0A0A) for page surfaces.
- Sidebar: `bg-zinc-950` with `border-zinc-800`.
- Cards: `bg-zinc-900 border-zinc-800`.
- Primary action / active states: `accent-primary` (#B8001F).
- Sonner mounted with `richColors theme="dark"` inside the admin layout (not globally) so the marketing site is unaffected.

## Database

No schema changes. Reuses existing `is_admin()` SQL function from Phase 1. The admin user `admin@fiteducationschool.com` must exist in `auth.users` and have a row in `user_roles` with `role = 'admin'` (provisioned via Supabase Studio, not in code).

## Error handling

- Invalid credentials → sonner toast "Email sau parolă incorectă", form remains filled.
- Authenticated but not admin → sign out, redirect to `/admin/login?error=unauthorized`, toast "Cont neautorizat".
- Supabase network error during sign-in → action returns `{ error: "A apărut o eroare. Încearcă din nou." }`, toast surfaces it.
- Session expiry mid-session → middleware fails to refresh → next server-rendered admin page sees no user → layout redirects to login.

## Acceptance criteria

1. Visiting `/admin` unauthenticated redirects to `/admin/login`.
2. Submitting valid admin credentials redirects to `/admin` and shows the sidebar shell + welcome card.
3. Submitting valid credentials for a non-admin user signs them out and returns to login with an error toast.
4. Submitting invalid credentials shows an error toast; the form is not cleared.
5. Sidebar shows all four nav items; clicking each routes correctly; active item is visually distinct.
6. `/admin/products`, `/admin/trainers`, `/admin/enrollments` each render the `ComingSoon` card.
7. Sign-out from the footer dropdown returns the user to `/admin/login`.
8. Marketing site (`/`, `/curs`) is visually unchanged and does not mount the admin Toaster.

## Out of scope (next slices)

- Trainers CRUD
- Products CRUD (with JSONB editors)
- Enrollments list
- Real dashboard statistics
- Audit log
