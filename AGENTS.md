# AI Agent Guidelines

This document provides context for AI coding assistants working with this codebase. It describes the project architecture, conventions, and common patterns to help you make accurate and consistent changes.

---

## Project Overview

**r3f-next-starter** is a React Three Fiber + Next.js starter template for building 3D web experiences. It uses:

- **Next.js 16** with App Router (`/app` directory)
- **React Three Fiber** for declarative 3D graphics
- **TypeScript** throughout
- **Tailwind CSS v4** for styling
- **Zustand** for state management
- **tunnel-rat** for cross-tree 3D rendering

---

## Architecture

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router pages and layouts |
| `src/components/canvas/` | 3D components (render inside Three.js Canvas) |
| `src/components/dom/` | 2D React components (standard HTML/JSX) |
| `src/sandboxes/` | Self-contained 3D scene modules |
| `src/config/` | Configuration files (sandbox registry) |
| `src/helpers/` | Tunnel setup and helper components |
| `src/hooks/` | Custom React hooks |
| `src/templates/` | Reusable code templates (shaders, etc.) |
| `src/store.ts` | Zustand global state |
| `public/models/` | Static 3D model files (.glb, .gltf) |

### The Tunnel Pattern

This project uses `tunnel-rat` to solve a common R3F challenge: rendering 3D content from components outside the Canvas.

```
┌─────────────────────────────────────────────────────────────┐
│  Root Layout (app/layout.tsx)                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  <Layout>                                             │  │
│  │    ├── <Scene>  ← Single persistent Canvas            │  │
│  │    │     └── <r3f.Out />  ← 3D content renders here   │  │
│  │    │     └── <ui.Out />   ← UI overlays render here   │  │
│  │    └── {children}  ← Page content                     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Any Page Component                                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  <Three>           ← Tunnel entrance for 3D           │  │
│  │    <mesh>...</mesh>  ← This renders in the Canvas     │  │
│  │  </Three>                                             │  │
│  │  <Ui>              ← Tunnel entrance for UI           │  │
│  │    <div>...</div>    ← This renders as overlay        │  │
│  │  </Ui>                                                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Files involved:**
- `src/helpers/global.ts` - Creates the tunnels
- `src/helpers/components/Three.tsx` - `<Three>` wrapper
- `src/helpers/components/Ui.tsx` - `<Ui>` wrapper
- `src/components/canvas/Scene.tsx` - Canvas with tunnel outlets

---

## Coding Conventions

### TypeScript

- Use explicit types for props and return values
- Prefer interfaces for object shapes
- Use `type` for unions and simple aliases
- Suffix refs with `Ref` (e.g., `meshRef`, `groupRef`)

```tsx
// Good
interface BoxProps {
  position: [number, number, number]
  color?: string
}

function Box({ position, color = 'orange' }: BoxProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  // ...
}
```

### React Three Fiber Components

- Mark all R3F components with `'use client'` directive
- Use `useFrame` for animations (not `requestAnimationFrame`)
- Use `useRef` with proper Three.js types
- Prefer drei helpers over raw Three.js when available

```tsx
'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export default function AnimatedBox() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta
    }
  })
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  )
}
```

### File Naming

- **Components:** PascalCase (`HomeScene.tsx`, `View.tsx`)
- **Hooks:** camelCase with `use` prefix (`useMobileCheck.ts`)
- **Utilities:** camelCase (`utils.ts`)
- **Config:** camelCase (`sandboxes.ts`)

### Component Organization

- Canvas components go in `src/components/canvas/`
- DOM components go in `src/components/dom/`
- Sandboxes (full scenes) go in `src/sandboxes/`
- Default export the main component

---

## Common Tasks

### Adding a New Sandbox

1. Create file in `src/sandboxes/YourSandbox.tsx`:

```tsx
'use client'

export default function YourSandbox({ onHomePage }: { onHomePage?: boolean }) {
  return (
    <>
      <color attach="background" args={['#111']} />
      <ambientLight intensity={0.5} />
      {/* Your 3D scene */}
    </>
  )
}
```

2. Register in `src/config/sandboxes.ts`:

```tsx
{
  slug: 'your-sandbox',
  title: 'Your Sandbox',
  char: 'Y',
  color: '#ff6b6b',
  position: [0, 50, 0],
  rotation: [0, 0, 0],
  description: 'Description here.',
  Component: dynamic(() => import('@/sandboxes/YourSandbox')),
}
```

3. Access at `/space/your-sandbox`

### Adding a Canvas Component

Create in `src/components/canvas/YourComponent.tsx`:

```tsx
'use client'

import { useFrame } from '@react-three/fiber'

interface YourComponentProps {
  // props
}

export default function YourComponent(props: YourComponentProps) {
  return (
    <group>
      {/* 3D content */}
    </group>
  )
}
```

### Adding a DOM Component

Create in `src/components/dom/YourComponent.tsx`:

```tsx
'use client'

interface YourComponentProps {
  children?: React.ReactNode
}

export default function YourComponent({ children }: YourComponentProps) {
  return (
    <div className="...">
      {children}
    </div>
  )
}
```

### Working with State

The Zustand store is in `src/store.ts`:

```tsx
// Reading state
const viewMode = useAppStore((state) => state.viewMode)

// Writing state
const setViewMode = useAppStore((state) => state.setViewMode)
setViewMode('3d')

// Multiple values
const { mode, setMode } = useAppStore((state) => ({
  mode: state.mode,
  setMode: state.setMode,
}))
```

### Loading 3D Models

```tsx
import { useGLTF } from '@react-three/drei'

function Model() {
  const { scene, nodes, materials } = useGLTF('/models/model.glb')
  return <primitive object={scene} />
}

// Preload for instant loading
useGLTF.preload('/models/model.glb')
```

### Adding Post-Processing

```tsx
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

function Effects() {
  return (
    <EffectComposer>
      <Bloom intensity={0.5} />
      <Vignette darkness={0.5} />
    </EffectComposer>
  )
}
```

---

## File Relationships

### Page Rendering Flow

```
app/page.tsx
  └── Checks viewMode from store
      ├── null → HomeSelection (choose 2D or 3D)
      ├── '2d' → Home2D component
      └── '3d' → HomeScene via <Three> tunnel
```

### Sandbox Rendering Flow

```
app/space/[...segments]/page.tsx
  └── Parses URL segments
  └── Looks up sandbox in src/config/sandboxes.ts
  └── Renders sandbox.Component via <Three> tunnel
```

---

## Important Patterns

### Hydration Safety

The store uses persistence. Always check hydration before rendering view-dependent content:

```tsx
import { useHydration } from '@/store'

function Component() {
  const hydrated = useHydration()
  
  if (!hydrated) {
    return <Loading />
  }
  
  return <ActualContent />
}
```

### Responsive 3D

Use the custom hook for mobile detection:

```tsx
import { useMobileCheck } from '@/hooks/useMobileCheck'

function ResponsiveScene() {
  const isMobile = useMobileCheck()
  
  return (
    <mesh scale={isMobile ? 0.5 : 1}>
      {/* ... */}
    </mesh>
  )
}
```

### Scene Transitions

The transition system in `src/components/canvas/Transition.tsx` handles page changes. State is managed via:

```tsx
const { startTransition, transitionState } = useAppStore()

// Trigger transition
startTransition('A') // 'A' is the target letter

// Transition states: 'idle' | 'out' | 'in'
```

---

## Testing Changes

1. Run `pnpm dev` for development server
2. Check the console for Three.js warnings
3. Test on mobile viewport (3D performance varies)
4. Run `pnpm lint` before committing

---

## Do's and Don'ts

### Do

- Use `'use client'` for all interactive/3D components
- Wrap async-loaded 3D content in `<Suspense>`
- Use `useFrame` for animation loops
- Clean up resources in `useEffect` return
- Type your Three.js refs properly

### Don't

- Don't use `requestAnimationFrame` directly (use `useFrame`)
- Don't create new objects inside `useFrame` (causes GC pressure)
- Don't forget `useGLTF.preload()` for models
- Don't mix Canvas components with DOM components
- Don't mutate state directly (use store actions)

---

## Useful drei Components

| Component | Purpose |
|-----------|---------|
| `<OrbitControls>` | Camera orbit controls |
| `<Html>` | Embed HTML in 3D space |
| `<Text>` | 3D text rendering |
| `<Float>` | Floating animation |
| `<ScrollControls>` | Scroll-based animations |
| `<Environment>` | HDR environment lighting |
| `<useGLTF>` | Load GLTF/GLB models |
| `<useTexture>` | Load textures |
| `<ContactShadows>` | Soft shadows |
| `<Sky>` | Procedural sky |

---

## Questions?

If unclear about a pattern, look at existing sandboxes in `src/sandboxes/` for reference implementations.

