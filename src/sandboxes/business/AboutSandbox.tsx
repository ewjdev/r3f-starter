'use client'

import { Html, ScrollControls, Scroll, useScroll, PerspectiveCamera } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

type CardConfig = {
  id: string
  title: string
  subtitle?: string
  content: React.ReactNode
  codeSnippet: string
  entryDirection: 'left' | 'right'
  accentColor: string
}

const SCROLL_PAGES = 5
const CARDS_COUNT = 4

// ═══════════════════════════════════════════════════════════════════════════════
// CARD CONTENT DATA
// ═══════════════════════════════════════════════════════════════════════════════

const CARDS: CardConfig[] = [
  {
    id: 'about-intro',
    title: 'About The Starter',
    subtitle: 'Accelerate Your Journey',
    content: (
      <div className='space-y-4'>
        <p className='text-lg leading-relaxed text-slate-100'>
          This starter template accelerates your journey into immersive web experiences.
        </p>
        <p className='text-sm text-slate-300/90 leading-relaxed'>
          Built with production-grade Three.js and React, it provides the foundation for stunning 3D product showcases,
          interactive configurators, and virtual showrooms.
        </p>
      </div>
    ),
    codeSnippet: `// AboutStarter.tsx
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'

export const AboutStarter = () => {
  return (
    <Canvas>
      <ScrollControls pages={4}>
        <ImmersiveScene />
      </ScrollControls>
    </Canvas>
  )
}

type StarterConfig = {
  threeJS: 'production-grade'
  features: ['3D showcases']
}`,
    entryDirection: 'left',
    accentColor: '#6fffe9',
  },
  {
    id: 'enterprise-solutions',
    title: 'Enterprise-Ready',
    subtitle: '3D Solutions',
    content: (
      <div className='space-y-4'>
        <ul className='space-y-2 text-slate-200 text-sm'>
          {[
            'Lightning-fast optimized rendering',
            'Responsive across every device',
            'SEO-friendly with SSR support',
          ].map((item, i) => (
            <li key={i} className='flex items-start gap-2'>
              <span className='mt-1 h-1.5 w-1.5 rounded-full bg-teal-400 shrink-0' />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
    codeSnippet: `// EnterpriseConfig.ts
const enterpriseConfig = {
  rendering: {
    optimized: true,
    targetFPS: 60,
    shadowQuality: 'high',
  },
  responsive: {
    breakpoints: ['mobile', 'tablet'],
    adaptiveQuality: true,
  },
  seo: {
    ssr: true,
    prerender: true,
  },
}`,
    entryDirection: 'right',
    accentColor: '#ffe66d',
  },
  {
    id: 'perfect-for',
    title: 'Perfect For',
    subtitle: 'Industries We Serve',
    content: (
      <div className='space-y-3'>
        <div className='grid grid-cols-2 gap-2'>
          {['E-commerce', 'Real Estate', 'Product Design', 'Architecture'].map((industry) => (
            <div
              key={industry}
              className='bg-white/10 rounded-lg px-3 py-2 text-center text-xs font-medium border border-white/5'
            >
              {industry}
            </div>
          ))}
        </div>
      </div>
    ),
    codeSnippet: `// Industries.tsx
type Industry = 
  | 'E-commerce' 
  | 'Real Estate'
  | 'Product Design' 
  | 'Architecture'

const useIndustryConfig = (
  industry: Industry
) => {
  const configs = {
    'E-commerce': {
      features: ['product-viewer'],
    },
    'Real Estate': {
      features: ['virtual-tour'],
    },
  }
  return configs[industry]
}`,
    entryDirection: 'left',
    accentColor: '#ff6b6b',
  },
  {
    id: 'scale-cta',
    title: 'Scale With Confidence',
    subtitle: 'Partner With Us',
    content: (
      <div className='space-y-3 text-center'>
        <p className='text-sm text-slate-100 leading-relaxed'>
          Ready to scale? <span className='text-amber-300 font-medium'>ewj.dev</span> offers custom 3D development
          services.
        </p>
      </div>
    ),
    codeSnippet: `// ScalePartnership.ts
export const scheduleConsult = async (
  payload: ConsultRequest
) => {
  const response = await fetch(
    'https://ewj.dev/api/consult',
    {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        services: [
          'commerce-integration',
          'custom-configurators',
        ],
      }),
    }
  )
  return response.json()
}`,
    entryDirection: 'right',
    accentColor: '#f77f00',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// SYNTAX HIGHLIGHTING
// ═══════════════════════════════════════════════════════════════════════════════

const highlightCode = (code: string): string => {
  // Escape HTML entities first
  let result = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Use markers to prevent regex conflicts, then replace at the end
  const tokens: { marker: string; html: string }[] = []
  let tokenId = 0

  const createToken = (html: string) => {
    const marker = `__TOKEN_${tokenId++}__`
    tokens.push({ marker, html })
    return marker
  }

  // Comments first (they can contain anything)
  result = result.replace(/(\/\/[^\n]*)/g, (_, comment) =>
    createToken(`<span style="color:#64748b;font-style:italic">${comment}</span>`),
  )

  // Strings (before keywords to avoid matching inside strings)
  result = result.replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, (_, str) =>
    createToken(`<span style="color:#fcd34d">${str}</span>`),
  )

  // Keywords
  result = result.replace(
    /\b(const|let|var|type|interface|return|export|import|from|async|await|new|function|true|false|satisfies)\b/g,
    (_, kw) => createToken(`<span style="color:#5eead4;font-weight:600">${kw}</span>`),
  )

  // Numbers (after keywords to not match inside tokens)
  result = result.replace(/\b(\d+)\b/g, (_, num) => createToken(`<span style="color:#7dd3fc">${num}</span>`))

  // Replace all tokens with their HTML
  tokens.forEach(({ marker, html }) => {
    result = result.replace(marker, html)
  })

  return result
}

// ═══════════════════════════════════════════════════════════════════════════════
// FLIPPING CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function FlipCard({ config, index }: { config: CardConfig; index: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const cardRef = useRef<THREE.Group>(null)
  const scroll = useScroll()
  const { viewport } = useThree()
  const [isFlipped, setIsFlipped] = useState(false)

  // Each card gets a section of the scroll
  const cardScrollStart = index / CARDS_COUNT
  const cardScrollEnd = (index + 1) / CARDS_COUNT
  const cardScrollMid = (cardScrollStart + cardScrollEnd) / 2

  useFrame((state) => {
    if (!groupRef.current || !cardRef.current) return

    const progress = scroll.offset
    const time = state.clock.elapsedTime

    // Simple evenly spaced card centers across the scroll range
    // Card 0: 0.125, Card 1: 0.375, Card 2: 0.625, Card 3: 0.875
    const cardCenter = (index + 0.5) / CARDS_COUNT

    // Distance from card's ideal position (normalized to card spacing)
    const spacing = 1 / CARDS_COUNT // 0.25 for 4 cards
    const normalizedDist = (progress - cardCenter) / spacing

    // Visibility: 1 when at center, fades as we move away
    const visibility = THREE.MathUtils.clamp(1 - Math.abs(normalizedDist) * 0.7, 0, 1)

    // X Position based on scroll progress relative to this card
    const slideDistance = viewport.width * 0.6
    const entrySide = config.entryDirection === 'left' ? -1 : 1

    let xPos = 0
    if (normalizedDist < -0.4) {
      // Card is ahead - waiting to enter from entry side
      const t = THREE.MathUtils.smoothstep(normalizedDist, -1.5, -0.4)
      xPos = THREE.MathUtils.lerp(slideDistance * entrySide, 0, t)
    } else if (normalizedDist > 0.4) {
      // Card has passed - exiting to opposite side
      const t = THREE.MathUtils.smoothstep(normalizedDist, 0.4, 1.5)
      xPos = THREE.MathUtils.lerp(0, -slideDistance * entrySide, t)
    }

    // Subtle floating animation when visible
    const floatY = Math.sin(time * 0.5 + index * 1.5) * 0.15 * visibility
    const floatX = Math.cos(time * 0.3 + index) * 0.08 * visibility

    // Apply position - centered in viewport
    const margin = viewport.width * 0.1
    const targetX = xPos + floatX
    groupRef.current.position.x = THREE.MathUtils.clamp(
      targetX,
      -viewport.width / 2 + margin,
      viewport.width / 2 - margin,
    )
    // groupRef.current.position.y = floatY
    groupRef.current.position.z = 0

    // Scale based on visibility
    const scale = THREE.MathUtils.lerp(0.5, 1, visibility)
    groupRef.current.scale.setScalar(Math.max(scale, 0.1))

    // Flip when in the snap zone (close to center)
    const isInSnapZone = Math.abs(normalizedDist) < 0.35
    setIsFlipped(isInSnapZone)

    // Y-axis rotation for flip
    const targetRotationY = isInSnapZone ? Math.PI : 0
    // cardRef.current.rotation.y = THREE.MathUtils.lerp(cardRef.current.rotation.y, targetRotationY, 0.1)

    // Tilt based on horizontal position
    groupRef.current.rotation.z = (xPos / slideDistance) * 0.08

    // Visibility control
    groupRef.current.visible = visibility > 0.1
  })

  return (
    <group ref={groupRef}>
      <group ref={cardRef}>
        {/* FRONT SIDE - Visual Content */}
        <Html transform distanceFactor={8} position={[0, 0, 0.01]} className='pointer-events-none select-none'>
          <div
            className='w-[320px] transition-opacity duration-200'
            style={{
              opacity: isFlipped ? 0 : 1,
              visibility: isFlipped ? 'hidden' : 'visible',
            }}
          >
            <div
              className='relative overflow-hidden rounded-2xl border border-white/15 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)]'
              style={{
                background: `linear-gradient(145deg, ${config.accentColor}18 0%, #030712f0 40%, #0a1628f0 100%)`,
                backdropFilter: 'blur(16px)',
              }}
            >
              {/* Accent glow */}
              <div
                className='absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-40'
                style={{ background: config.accentColor }}
              />

              {/* Header */}
              <div className='relative mb-4'>
                {config.subtitle && (
                  <p
                    className='text-[10px] uppercase tracking-[0.35em] mb-1.5 font-medium'
                    style={{ color: config.accentColor }}
                  >
                    {config.subtitle}
                  </p>
                )}
                <h2 className='text-xl font-bold text-white tracking-tight'>{config.title}</h2>
              </div>

              {/* Content */}
              <div className='relative'>{config.content}</div>

              {/* Footer */}
              <div className='mt-5 pt-3 border-t border-white/10 flex items-center justify-between'>
                <span className='text-[10px] text-slate-500 uppercase tracking-wider'>Scroll to reveal code</span>
                <div className='w-2 h-2 rounded-full animate-pulse' style={{ background: config.accentColor }} />
              </div>
            </div>
          </div>
        </Html>

        {/* BACK SIDE - Code Content */}
        <Html
          transform
          distanceFactor={8}
          position={[0, 0, -0.01]}
          rotation={[0, Math.PI, 0]}
          className='pointer-events-none select-none'
        >
          <div
            className='w-[320px] transition-opacity duration-200'
            style={{
              opacity: isFlipped ? 1 : 0,
              visibility: isFlipped ? 'visible' : 'hidden',
            }}
          >
            <div className='bg-[#0a0f1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)]'>
              {/* Code header - macOS style */}
              <div className='flex items-center gap-2.5 mb-4 pb-3 border-b border-white/5'>
                <div className='flex gap-1.5'>
                  <div className='w-2.5 h-2.5 rounded-full bg-[#ff5f57]' />
                  <div className='w-2.5 h-2.5 rounded-full bg-[#febc2e]' />
                  <div className='w-2.5 h-2.5 rounded-full bg-[#28c840]' />
                </div>
                <span className='text-[10px] text-slate-500 font-mono ml-2'>{config.id}.tsx</span>
                <div
                  className='ml-auto px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-semibold'
                  style={{ background: `${config.accentColor}25`, color: config.accentColor }}
                >
                  TS
                </div>
              </div>

              {/* Code content */}
              <pre
                className='font-mono text-[11px] leading-relaxed text-slate-200 whitespace-pre-wrap overflow-hidden'
                dangerouslySetInnerHTML={{ __html: highlightCode(config.codeSnippet) }}
              />

              {/* Code footer */}
              <div className='mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-600'>
                <span>{config.codeSnippet.split('\n').length} lines</span>
                <span className='flex items-center gap-1.5'>
                  <span className='inline-block w-1.5 h-1.5 rounded-full' style={{ background: config.accentColor }} />
                  Production Ready
                </span>
              </div>
            </div>
          </div>
        </Html>
      </group>
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// AMBIENT CODE RAIN (Background)
// ═══════════════════════════════════════════════════════════════════════════════

const RAIN_SNIPPETS = [
  'useFrame(() => {})',
  '<Canvas />',
  'THREE.Vector3()',
  'position={[0,0,0]}',
  'mesh.rotation.y++',
  '<Html transform />',
  'useScroll()',
  'ref.current',
]

function CodeRainParticle({
  snippet,
  startX,
  startY,
  speed,
  delay,
}: {
  snippet: string
  startX: number
  startY: number
  speed: number
  delay: number
}) {
  const ref = useRef<THREE.Group>(null)
  const scroll = useScroll()

  useFrame((state) => {
    if (!ref.current) return
    const time = state.clock.elapsedTime + delay
    const scrollY = scroll.offset * 40

    ref.current.position.x = startX + Math.sin(time * speed * 0.5) * 1.5
    ref.current.position.y = ((startY - scrollY * speed) % 30) + 15
    ref.current.rotation.z = Math.sin(time * 0.2) * 0.15

    // Fade based on Y position
    const opacity =
      THREE.MathUtils.smoothstep(ref.current.position.y, -5, 5) *
      THREE.MathUtils.smoothstep(ref.current.position.y, 20, 10)
    ref.current.scale.setScalar(opacity * 0.8 + 0.2)
  })

  return (
    <group ref={ref} position={[startX, startY, -25]}>
      <Html transform distanceFactor={25} className='pointer-events-none'>
        <div className='text-[9px] font-mono text-slate-700/50 whitespace-nowrap'>{snippet}</div>
      </Html>
    </group>
  )
}

function AmbientCodeRain() {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        snippet: RAIN_SNIPPETS[i % RAIN_SNIPPETS.length],
        startX: (Math.random() - 0.5) * 40,
        startY: Math.random() * 30,
        speed: 0.4 + Math.random() * 0.5,
        delay: Math.random() * 10,
      })),
    [],
  )

  return (
    <>
      {particles.map((p) => (
        <CodeRainParticle key={p.id} {...p} />
      ))}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCROLL PROGRESS INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════

function ScrollProgress() {
  const scroll = useScroll()
  const dotsRef = useRef<(HTMLDivElement | null)[]>([])

  useFrame(() => {
    const progress = scroll.offset
    CARDS.forEach((card, i) => {
      const dot = dotsRef.current[i]
      if (!dot) return

      // Same simple center calculation as FlipCard
      const cardCenter = (i + 0.5) / CARDS_COUNT
      const distance = Math.abs(progress - cardCenter)
      const isActive = distance < 1 / CARDS_COUNT / 2 // Active within half a card's range

      dot.style.transform = `scale(${isActive ? 1.8 : 1})`
      dot.style.background = isActive ? card.accentColor : 'rgba(255,255,255,0.25)'
      dot.style.boxShadow = isActive ? `0 0 12px ${card.accentColor}` : 'none'
    })
  })

  return (
    <Html position={[5, 0, 0]} className='pointer-events-none'>
      <div className='flex flex-col gap-5'>
        {CARDS.map((card, i) => (
          <div
            key={card.id}
            ref={(el) => {
              dotsRef.current[i] = el
            }}
            className='w-2 h-2 rounded-full transition-all duration-300 ease-out'
            style={{ background: 'rgba(255,255,255,0.25)' }}
          />
        ))}
      </div>
    </Html>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TITLE OVERLAY
// ═══════════════════════════════════════════════════════════════════════════════

function TitleOverlay() {
  const scroll = useScroll()
  const ref = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!ref.current) return
    const progress = scroll.offset

    // Fade out as user scrolls
    const opacity = THREE.MathUtils.smoothstep(progress, 0, 0.15)
    ref.current.position.y = THREE.MathUtils.lerp(0, 3, progress * 2)
    ref.current.scale.setScalar(1 - progress * 0.5)
  })

  return (
    <group ref={ref} position={[0, 4, -8]}>
      <Html transform distanceFactor={10} className='pointer-events-none'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-white tracking-tight mb-2'>Visual Code Cards</h1>
          <p className='text-slate-400 text-sm'>Scroll to explore • Cards flip to reveal code</p>
        </div>
      </Html>
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SCENE
// ═══════════════════════════════════════════════════════════════════════════════

function Scene() {
  return (
    <>
      {/* <AmbientCodeRain /> */}
      {/* <TitleOverlay /> */}
      {CARDS.map((card, index) => (
        <FlipCard key={card.id} config={card} index={index} />
      ))}
      {/* <ScrollProgress /> */}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function AboutSandbox({ onHomePage }: { onHomePage?: boolean }) {
  return (
    <>
      <color attach='background' args={['#050a12']} />
      <fog attach='fog' args={['#050a12', 15, 35]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 4]} intensity={0.5} />
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={50} />

      <ScrollControls pages={1} damping={0.12} style={{ pointerEvents: 'auto' }}>
        {!onHomePage && <Scene />}
      </ScrollControls>
    </>
  )
}
