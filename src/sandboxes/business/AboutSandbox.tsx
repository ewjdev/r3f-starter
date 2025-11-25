'use client'

import { Ui } from '@/helpers/components/Ui'
import { Text, Float, OrthographicCamera, Html, ScrollControls, Scroll, useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

type SnippetConfig = {
  id: string
  code: string
  x: number
  startY: number
  z: number
  drift: number
  tilt: number
  accent: string
}

const ACCENT_COLORS = ['#ffe66d', '#1a535c', '#6fffe9', '#ff6b6b', '#f77f00']
const SCROLL_RANGE = 24

const CODE_LIBRARY = [
  `type ExperienceBlueprint = {
    lighting: 'studio' | 'retail'
    realtimeShadows: boolean
    targetFPS: number
    analyticsTag?: string
  }`,
  `interface StarterMetrics {
    cmsReady: boolean
    clsScore: number
    lighthouseScore: {
      performance: number
      accessibility: number
      seo: number
    }
  }`,
  `const buildProductShowcase = (heroId: string, options: ExperienceBlueprint) => {
    const timeline = new TimelineLite()
    timeline.to(heroId, { opacity: 1, duration: 0.6 })
    return { timeline, options }
  }`,
  `type DeploymentPipeline = {
    environments: Array<'dev' | 'preview' | 'prod'>
    onSuccess: (url: string) => void
    rollback: () => Promise<void>
  }`,
  `const useImmersiveHero = (ref: THREE.Group, config: ExperienceBlueprint) => {
    useFrame((state) => {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.2
    })
    return config
  }`,
  `interface ServicesPackage {
    tier: 'launchpad' | 'scale' | 'enterprise'
    includes: string[]
    priceFrom: number
  }`,
  `export const scheduleEwjDevSprint = async (payload: {
    project: string
    scope: string[]
    stakeholders: string[]
  }) => {
    const response = await fetch('/api/sprint', { method: 'POST', body: JSON.stringify(payload) })
    return response.json()
  }`,
  `const realtimeConfig: ExperienceBlueprint = {
    lighting: 'studio',
    realtimeShadows: true,
    targetFPS: 60,
  }`,
  `type ImmersiveCTA = {
    label: string
    href: string
    onEngage?: () => void
  }`,
]

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min

const createSnippets = (count: number): SnippetConfig[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `snippet-${index}-${Math.random().toString(16).slice(2)}`,
    code: CODE_LIBRARY[Math.floor(Math.random() * CODE_LIBRARY.length)],
    x: randomRange(-7, 7),
    startY: randomRange(6, 18),
    z: randomRange(-8, -16),
    drift: randomRange(0.6, 1.2),
    tilt: randomRange(-0.4, 0.4),
    accent: ACCENT_COLORS[index % ACCENT_COLORS.length],
  }))

const highlightTs = (code: string) => {
  let escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  escaped = escaped.replace(
    /\b(const|type|interface|extends|return|export|import|from|implements|async|await|readonly|new)\b/g,
    `<span class="text-teal-300 font-semibold">$1</span>`,
  )
  escaped = escaped.replace(/(`[^`]*`|'[^']*'|"[^"]*")/g, `<span class="text-amber-200">$1</span>`)
  return escaped.replace(/\b(\d+)\b/g, `<span class="text-sky-300">$1</span>`)
}

function CodeRain({ snippets }: { snippets: SnippetConfig[] }) {
  const scroll = useScroll()
  const snippetRefs = useRef<Array<THREE.Group | null>>([])

  useFrame((state) => {
    const progress = scroll.offset
    const scrollOffset = progress * SCROLL_RANGE

    snippets.forEach((config, index) => {
      const ref = snippetRefs.current[index]
      if (!ref) return
      const sway = Math.sin((state.clock.elapsedTime + index) * config.drift) * 0.7
      const yPosition = config.startY - scrollOffset + sway

      ref.position.set(config.x + sway * 0.3, yPosition, config.z)
      ref.rotation.set(
        -0.45 + progress * 0.3,
        config.tilt + progress * 1.2,
        Math.sin(state.clock.elapsedTime * 0.15 + index * 0.2) * 0.2,
      )
    })
  })

  return (
    <>
      {snippets.map((config, index) => (
        <group
          key={config.id}
          ref={(node) => (snippetRefs.current[index] = node)}
          position={[config.x, config.startY, config.z]}
        >
          <Html transform distanceFactor={18} className='pointer-events-none'>
            <div className='bg-[#030712]/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-[0_25px_60px_rgba(0,0,0,0.55)] min-w-[220px] max-w-[260px]'>
              <div className='flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-slate-400'>
                <span className='inline-flex h-2 w-2 rounded-full' style={{ background: config.accent }} />
                TS
              </div>
              <pre
                className='mt-2 font-mono text-xs leading-relaxed text-slate-100 whitespace-pre-wrap'
                dangerouslySetInnerHTML={{ __html: highlightTs(config.code) }}
              />
            </div>
          </Html>
        </group>
      ))}
    </>
  )
}

function Scene({ snippets }: { snippets: SnippetConfig[] }) {
  return (
    <>
      <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <Text position={[0, 9, -6]} fontSize={1.2} color='#e6fbff' anchorX='center' anchorY='middle'>
          Transform Your Business with 3D Web Experiences
        </Text>
      </Float>
      <CodeRain snippets={snippets} />
    </>
  )
}

export default function AboutSandbox({ onHomePage }: { onHomePage?: boolean }) {
  const snippets = useMemo(() => createSnippets(12), [])

  return (
    <>
      <color attach='background' args={['#010a13']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[6, 8, 4]} intensity={0.8} />
      <OrthographicCamera makeDefault position={[0, 0, 12]} zoom={18} />

      <ScrollControls pages={3} damping={0.2}>
        {!onHomePage && <Scene snippets={snippets} />}

        <Scroll html style={{ width: '100%', height: '100%', display: onHomePage ? 'none' : 'block' }}>
          <div className='w-full text-white pointer-events-auto'>
            <section className='min-h-screen flex items-center justify-center px-6 md:px-16'>
              <div className='max-w-3xl w-full bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl'>
                <p className='text-sm uppercase tracking-[0.4em] text-teal-200 mb-4'>About The Starter</p>
                <p className='text-2xl md:text-3xl text-slate-100 leading-relaxed'>
                  This starter template accelerates your journey into immersive web experiences. Built with
                  production-grade Three.js and React, it provides the foundation for stunning 3D product showcases,
                  interactive configurators, and virtual showrooms.
                </p>
                <p className='mt-6 text-slate-300 text-lg'>
                  Every layout is optimized for storytelling, speed, and accessibility so your team can focus on content
                  strategy instead of rebuilding infrastructure.
                </p>
              </div>
            </section>

            <section className='min-h-screen flex items-center px-6 md:px-16'>
              <div className='grid gap-8 w-full md:grid-cols-2'>
                <div className='bg-[#0b1624]/80 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-2xl'>
                  <h3 className='text-2xl font-semibold text-teal-200 mb-6'>Enterprise-Ready 3D Solutions</h3>
                  <ul className='space-y-5 text-slate-200'>
                    <li className='flex gap-3'>
                      <span className='text-teal-300'>•</span>
                      <span>Lightning-fast performance with optimized rendering</span>
                    </li>
                    <li className='flex gap-3'>
                      <span className='text-teal-300'>•</span>
                      <span>Responsive design that works across every device and touchpoint</span>
                    </li>
                    <li className='flex gap-3'>
                      <span className='text-teal-300'>•</span>
                      <span>SEO-friendly architecture with SSR support and analytics hooks</span>
                    </li>
                  </ul>
                </div>

                <div className='bg-[#112e36]/80 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-2xl'>
                  <h4 className='text-xl font-semibold text-amber-200 mb-4'>Perfect For</h4>
                  <div className='grid grid-cols-2 gap-3 text-sm'>
                    {['E-commerce', 'Real Estate', 'Product Design', 'Architecture'].map((industry) => (
                      <div key={industry} className='bg-white/10 rounded-2xl px-4 py-3 text-center'>
                        {industry}
                      </div>
                    ))}
                  </div>
                  <p className='text-slate-200 text-sm mt-5'>
                    From concept to deployment, we handle the technical complexity while you focus on your business
                    goals.
                  </p>
                </div>
              </div>
            </section>

            <section className='min-h-screen flex items-center justify-center px-6 md:px-16 pb-16'>
              <div className='max-w-2xl w-full text-center bg-linear-to-br from-[#1a535c]/90 to-[#0b1624]/90 border border-white/10 rounded-3xl p-10 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.45)]'>
                <h5 className='text-sm uppercase tracking-[0.4em] text-amber-200 mb-4'>Scale With Confidence</h5>
                <p className='text-lg md:text-xl text-slate-100 leading-relaxed mb-6'>
                  Ready to scale?{' '}
                  <a
                    href='https://ewj.dev'
                    className='text-amber-200 underline underline-offset-4 hover:text-amber-100'
                  >
                    ewj.dev
                  </a>{' '}
                  offers custom development services to build comprehensive 3D applications tailored to your business
                  needs.
                </p>
                <p className='text-slate-300'>
                  Extend this starter with bespoke commerce integrations, configurators, analytics, and storytelling
                  moments crafted by a partner who ships production-ready immersive experiences every week.
                </p>
              </div>
            </section>
          </div>
        </Scroll>
      </ScrollControls>
    </>
  )
}
