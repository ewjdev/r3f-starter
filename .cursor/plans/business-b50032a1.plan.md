<!-- b50032a1-764d-4322-8033-05578205437b 5951a72f-84c9-4370-9d6e-e3bba633270a -->
# Business Starter Build Plan

## Current State Highlights

- `src/components/canvas/HomeScene.tsx` already assembles physics-driven letter sculptures with embedded sandboxes and resets the transition store after mount, giving us a reusable scene container.
```42:78:src/components/canvas/HomeScene.tsx
      <Physics gravity={[0, -60, 0]}>
        <Letter color='#000000' char='e' position={[2, 50, -2]} rotation={[4, 5, 6]}>
          <Shoe scale={5} />
        </Letter>
        <Letter color='#ffffff' char='w' position={[3, 70, 2]} rotation={[7, 8, 9]}>
          <Turtle />
        </Letter>
```

- Each letter click triggers `startTransition` and routes into `/space/[id]`, where `app/space/[id]/page.tsx` lazily mounts the corresponding sandbox.
```35:48:src/components/canvas/Letter.tsx
  const handleClick = async (e: any) => {
    e.stopPropagation()
    startTransition(char)
    if (main.current && controls) {
      await controls.fitToBox(main.current, true, { paddingLeft: 2 })
      router.push(`/space/${char.toLowerCase()}`)
```

- The dynamic route currently hardcodes the sandbox map and an animated back button, giving us a foundation for page-specific intros/outros.
```23:41:app/space/[id]/page.tsx
const Components = {
  s: Turtle,
  t: Rocket,
  a: PingPong,
  r: Stencil,
  e: Turtle,
}
...
const [exiting, setExiting] = useState(false)
```


Variables

- CMS interfaces
 - (default) squarespace
 - shopify
- 

## Implementation Steps

1. **Content Architecture & CMS Bridge**

   - Introduce `src/config/sandboxes.ts` to declare the business sandboxes (about, services, products, contact) with copy, media, scene component, and CMS document IDs.
   - Build `src/lib/cms.ts` wrapping the chosen headless {{CMS}} 
    - ; hydrate static props in `app/(sandboxes)/[slug]/page.tsx `via `fetchSandbox(slug)` so each scene receives structured business data.
   - Add `.env` scaffolding plus TypeScript types for CMS responses to keep the starter production-ready.

2. **Navigation Shell & Transition Orchestrator**

   - Replace the letter-only entry interaction with a shared config-driven nav: add `components/dom/HamburgerNav.tsx` that mirrors the current letter aesthetic (animated glyphs, spring physics) but surfaces as a hamburger toggle that animates in/out using `@react-spring/web`.
   - Extend `src/store.ts` with nav state (`isNavOpen`, `activeSlug`, per-route intro/outro durations) and expose actions consumed by the nav, `HomeScene`, and the App Router.
   - Add a `TransitionManager` hook that listens to `next/navigation` events, flips `transitionState` before pushes, and waits for outro completion before resolving.

3. **Home Scene & Letter Refactor**

   - Refactor `HomeScene` and `Letter` to pull their letter list, colors, and embedded sandbox previews from `config/sandboxes`; this keeps the home hero synchronized with the CMS data.
   - Layer in UI overlays (CTA copy, gradient backplates) via `ui.In` tunnel so the home page also communicates business messaging while 3D letters float beneath.
   - Ensure CameraControls targets and physics boundaries adapt to the number of letters (e.g., auto-spread positions based on config).

4. **Sandbox Scenes per Business Vertical**

   - Create dedicated components under `src/sandboxes/business/`:
     - `AboutSandbox`: blend `VideoTexture` materials for storytelling plus floating image planes sourced from CMS media.
     - `ServicesSandbox`: showcase instanced meshes / sprite cards with scroll-triggered intros that highlight capabilities.
     - `ProductsSandbox`: load GLTF product models (or proxy primitives) plus world-space UI linking out to the existing store.
     - `ContactSandbox`: combine particle systems, Drei `<Html>` overlays, and form hooks to demonstrate real-world input handling. should hook email with resend
   - Keep a shared `SandboxFrame` wrapper that injects lights, camera, and route-specific intro/outro timelines so every sandbox feels cohesive yet distinct.

5. **App Router Structure & Page Transitions**

   - Restructure routes under `app/(marketing)/page.tsx` for home and `app/(sandboxes)/[slug]/page.tsx` for detail scenes so layouts can include page-level intro/outro wrappers.
   - Introduce `components/canvas/PageTransition.tsx` (post-processing stack) to complement the existing `Transition` effect with per-route parameters (pixelation strength, depth-of-field) driven by config.
   - Ensure nav selections push through `router.push('/space/[slug]')`, await the outro promise, then display the sandbox with a matching intro timeline (camera fly-in + CMS-fed text fades).

6. **Docs, Testing & DX Polish**

   - Update `README.md` with setup instructions (env vars, CMS tokens, running `pnpm dev`), list available sandboxes, and explain how to add new ones.
   - Add Storybook/MDX snippets or minimal unit tests for store logic (transition timing, nav toggling) to avoid regressions and make the starter trustworthy for agencies.
   - Document recommended asset conventions (GLB compression, video codecs) plus performance budgets so businesses can extend safely.

## Proposed Implementation

- `cms-config`: Define sandbox config
- `nav-transitions`: Build hamburger nav, extend Zustand store, add TransitionManager.
- `home-refactor`: Drive letters/home scene from config and share data with nav.
- `sandboxes-build`: Implement the four business sandboxes with unique visuals.
- `router-dx-docs`: Finalize App Router structure, transitions, and documentation.

### To-dos

- [ ] Review current starter structure/features
- [ ] Outline plan for business sandboxes
- [ ] sandboxes-build: Implement the four business sandboxes with unique visuals.
- [ ] router-dx-docs: Finalize App Router structure, transitions, and documentation.Verify the same functionality that e
- [ ] Review current starter structure/features
- [ ] Outline plan for business sandboxes
- [ ] sandboxes-build: Implement the four business sandboxes with unique visuals.
- [ ] router-dx-docs: Finalize App Router structure, transitions, and documentation.Verify the same functionality that e
- [ ] Review current starter structure/features
- [ ] Outline plan for business sandboxes
- [ ] sandboxes-build: Implement the four business sandboxes with unique visuals.
- [ ] router-dx-docs: Finalize App Router structure, transitions, and documentation.Verify the same functionality that e