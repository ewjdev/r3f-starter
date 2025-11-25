# r3f-next-starter

A production-ready starter template for building immersive 3D web experiences with **React Three Fiber**, **Next.js 16**, and **TypeScript**.

---

## Features

- **React Three Fiber** - Declarative Three.js with React
- **Next.js 16** - App Router, Server Components, and optimized builds
- **TypeScript** - Full type safety throughout
- **Tailwind CSS v4** - Modern utility-first styling
- **Zustand** - Lightweight state management with persistence
- **@react-three/drei** - Useful helpers for R3F (controls, loaders, abstractions)
- **@react-three/postprocessing** - Post-processing effects
- **@react-three/rapier** - Physics simulation
- **@react-three/uikit** - 3D UI components
- **GLSL Support** - Custom shaders with glslify
- **Sandbox System** - Modular 3D scene architecture
- **View Mode Toggle** - Switch between 2D and 3D experiences
- **Scene Transitions** - Smooth animated transitions between pages

---

## Quick Start

### Prerequisites

- **Node.js** >= 22.x
- **pnpm** (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/r3f-next-starter.git
cd r3f-next-starter

# Run the setup script (installs dependencies and validates environment)
pnpm setup

# Or install manually
pnpm install

# Start development server (with HTTPS)
pnpm dev
```

The app will be available at `https://localhost:3000`

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with HTTPS |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint with auto-fix |
| `pnpm analyze` | Analyze bundle size |
| `pnpm new:sandbox` | Generate a new sandbox scene |
| `pnpm new:component` | Generate a new component (canvas or DOM) |
| `pnpm setup` | Initialize project after cloning |
| `pnpm reset` | Reset to blank starter state |

---

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with 3D canvas
│   ├── page.tsx             # Home page with view mode selection
│   └── space/               # Dynamic routes for sandboxes
│       └── [...segments]/
│           └── page.tsx     # Sandbox renderer
│
├── src/
│   ├── components/
│   │   ├── canvas/          # 3D components (rendered in Canvas)
│   │   │   ├── Scene.tsx    # Main canvas wrapper
│   │   │   ├── HomeScene.tsx
│   │   │   ├── View.tsx     # Viewport for 3D scenes
│   │   │   └── ...
│   │   └── dom/             # 2D components (HTML/React)
│   │       ├── Layout.tsx   # DOM layout wrapper
│   │       └── ...
│   │
│   ├── config/
│   │   └── sandboxes.ts     # Sandbox registry
│   │
│   ├── helpers/
│   │   ├── global.ts        # Tunnel-rat setup for R3F
│   │   └── components/
│   │       ├── Three.tsx    # Helper to inject into 3D scene
│   │       └── Ui.tsx       # Helper to inject UI overlays
│   │
│   ├── hooks/               # Custom React hooks
│   ├── sandboxes/           # 3D scene modules
│   │   ├── Basic.tsx
│   │   └── business/        # Example business sandboxes
│   │
│   ├── templates/           # Reusable templates
│   │   └── Shader/          # Custom shader template
│   │
│   ├── store.ts             # Zustand store
│   └── utils.ts             # Utility functions
│
├── public/                  # Static assets
│   ├── models/              # 3D models (.glb)
│   └── icons/               # PWA icons
│
└── scripts/                 # Developer scripts
    ├── new-sandbox.js       # Sandbox generator
    ├── new-component.js     # Component generator
    ├── setup.js             # Project setup
    └── reset.js             # Reset to starter state
```

---

## Creating a New Sandbox

Sandboxes are self-contained 3D scenes. Use the generator or create manually:

### Using the Generator

```bash
pnpm new:sandbox
```

Follow the prompts to create a new sandbox with boilerplate code.

### Manual Creation

1. Create a new file in `src/sandboxes/`:

```tsx
// src/sandboxes/MySandbox.tsx
'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export default function MySandbox() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </>
  )
}
```

2. Register in `src/config/sandboxes.ts`:

```tsx
import dynamic from 'next/dynamic'

export const sandboxes: SandboxConfig[] = [
  // ... existing sandboxes
  {
    slug: 'my-sandbox',
    title: 'My Sandbox',
    char: 'M',
    color: '#ff6b6b',
    position: [0, 50, 0],
    rotation: [0, 0, 0],
    description: 'My custom 3D scene.',
    Component: dynamic(() => import('@/sandboxes/MySandbox')),
  },
]
```

3. Visit `/space/my-sandbox` to see your sandbox.

---

## Architecture Overview

### Tunnel Pattern

This starter uses [tunnel-rat](https://github.com/pmndrs/tunnel-rat) to enable components anywhere in the React tree to render into the shared 3D canvas:

```tsx
// In any component
import { Three } from '@/helpers/components/Three'

function MyPage() {
  return (
    <Three>
      {/* This renders inside the Canvas */}
      <mesh>
        <sphereGeometry />
        <meshBasicMaterial />
      </mesh>
    </Three>
  )
}
```

### State Management

Zustand store with persistence (`src/store.ts`):

```tsx
import { useAppStore } from '@/store'

// Access state
const viewMode = useAppStore((state) => state.viewMode)

// Update state
const setViewMode = useAppStore((state) => state.setViewMode)
setViewMode('3d')
```

---

## Adding 3D Models

Place `.glb` or `.gltf` files in `public/models/` and load them with drei:

```tsx
import { useGLTF } from '@react-three/drei'

function Model() {
  const { scene } = useGLTF('/models/my-model.glb')
  return <primitive object={scene} />
}

// Preload for better performance
useGLTF.preload('/models/my-model.glb')
```

---

## Custom Shaders

Use the shader template in `src/templates/Shader/`:

```tsx
import Shader from '@/templates/Shader/Shader'

function MyScene() {
  return <Shader />
}
```

Or create custom shaders with glslify:

```tsx
// Import GLSL files
import vertexShader from './shader.vert'
import fragmentShader from './shader.frag'

<shaderMaterial
  vertexShader={vertexShader}
  fragmentShader={fragmentShader}
  uniforms={{ uTime: { value: 0 } }}
/>
```

---

## Performance Tips

1. **Use `<Suspense>` boundaries** for async loaded components
2. **Preload models and textures** with `useGLTF.preload()` and `useTexture.preload()`
3. **Instance meshes** when rendering many similar objects
4. **Use LOD (Level of Detail)** for complex scenes
5. **Optimize DPR** - Already configured in `Scene.tsx` for mobile
6. **Memoize complex calculations** with `useMemo`

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

### Static Export

```bash
pnpm build
# Output in .next/
```

---

## Resources

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Drei Helpers](https://github.com/pmndrs/drei)
- [Three.js Docs](https://threejs.org/docs/)
- [Next.js Docs](https://nextjs.org/docs)
- [Zustand](https://github.com/pmndrs/zustand)

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Credits

Built on top of [create-r3f-app](https://github.com/utsuboco/create-r3f-app) by [Renaud ROHLINGER](https://twitter.com/onirenaud).
