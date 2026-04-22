# Project Instructions for Claude Code

## Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** React functional components with hooks
- **Component library:** shadcn/ui (Radix UI primitives)

## Design System
All UI work must follow the **Paper Design System** defined in `paper-SKILL.md`.

Key rules:
- Typography: Roboto (body), Montserrat (display), PT Mono (code)
- Color tokens: `primary=#111111`, `secondary=#8B5CF6`, `surface=#FFFFFF`, `text=#111827`
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32
- Style: minimal, clean, print-inspired
- Accessibility: WCAG 2.2 AA, keyboard-first, visible focus states

Always use semantic color tokens, never raw hex values in components.

## Project Structure
Architecture: **Feature Slice Design (FSD)**

```
src/
├── app/                  # Next.js App Router (pages and layouts only, no logic)
│   ├── (routes)/
│   └── layout.tsx
│
├── processes/            # Cross-feature workflows (auth flow, checkout...)
│
├── features/             # Independent feature slices
│   └── [feature-name]/
│       ├── ui/           # Components specific to this feature
│       ├── model/        # State, stores, business logic
│       ├── api/          # API calls for this feature
│       ├── lib/          # Feature-specific utils
│       └── index.ts      # Public API — only export what's needed
│
├── entities/             # Business domain objects (user, product, order...)
│   └── [entity-name]/
│       ├── ui/           # Entity UI (UserCard, ProductBadge...)
│       ├── model/        # Entity types and store
│       └── index.ts
│
├── shared/               # Truly reusable, no business logic
│   ├── ui/               # shadcn + Paper design system base components
│   ├── lib/              # Generic utils (formatDate, cn...)
│   ├── api/              # Base API client / fetcher
│   └── config/           # Env vars, constants
│
└── styles/               # globals.css, Tailwind config
```

### FSD Rules
- **Import direction is strict:** `app` → `processes` → `features` → `entities` → `shared`
- Upper layers can import from lower layers, never the reverse
- Each slice exposes only what's in its `index.ts` — never import from internal paths (e.g. `features/auth/model/store`)
- `shared/ui` is where shadcn components live after install and Paper adaptation
- `app/` contains only routing and layout — all logic lives in features or entities

## Code Rules
- Use TypeScript strictly — no `any`
- Functional components only, no class components
- Co-locate component styles, types, and tests in the same folder
- Use named exports for components, default export only for pages
- Prefer composition over prop drilling; use context sparingly
- All components must handle empty states and loading states
- Write accessible markup: semantic HTML, ARIA labels where needed

## Naming Conventions
- Components: `PascalCase` (e.g. `UserCard.tsx`)
- Hooks: `camelCase` prefixed with `use` (e.g. `useUserData.ts`)
- Utils: `camelCase` (e.g. `formatDate.ts`)
- CSS classes: Tailwind utilities only, no custom class names unless necessary

## shadcn/ui + Paper Design System
shadcn components must be adapted to Paper tokens. Never use shadcn's default theme as-is.

CSS variable mapping in `globals.css`:
```css
:root {
  --background: #FFFFFF;    /* surface */
  --foreground: #111827;    /* text */
  --primary: #111111;       /* primary */
  --primary-foreground: #FFFFFF;
  --secondary: #8B5CF6;     /* secondary */
  --secondary-foreground: #FFFFFF;
  --destructive: #DC2626;   /* danger */
  --ring: #111111;          /* focus ring */
  --radius: 0.25rem;        /* minimal border radius, paper feel */
}
```

Rules when using shadcn components:
- Always install via `npx shadcn@latest add <component>` — never copy manually
- After installing, review the generated file and replace any hardcoded colors with Paper tokens
- Strip drop shadows and heavy gradients — Paper style is flat and minimal
- Font must be overridden to Roboto/Montserrat, shadcn defaults to Geist
- Keep Radix UI accessibility attributes intact — never remove `aria-*` or `data-*` props
- Prefer shadcn primitives (Dialog, Popover, Select...) over building from scratch

## When generating components
1. Check `paper-SKILL.md` for the relevant component pattern first
2. Define all states: default, hover, focus-visible, active, disabled, error
3. Include responsive behavior
4. Add TypeScript props interface
5. Keep components under 150 lines — split if larger
