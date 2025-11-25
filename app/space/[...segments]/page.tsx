'use client'

import { Suspense, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSpring, animated } from '@react-spring/web'
import { useAppStore, useHydration } from '@/store'
import { Three } from '@/helpers/components/Three'
import { sandboxes } from '@/config/sandboxes'
import { cn } from '@/utils'
import Generic2DPage from '@/components/dom/Generic2DPage'

export default function SandboxPage() {
  const params = useParams<{ segments: string[] }>()
  const segments = params?.segments ?? []
  const slug = Array.isArray(segments) ? segments[0] : undefined
  const detailSlug = Array.isArray(segments) ? segments[1] : undefined
  const router = useRouter()
  const endTransition = useAppStore((state) => state.endTransition)
  const startTransition = useAppStore((state) => state.startTransition)
  const viewMode = useAppStore((state) => state.viewMode)
  const hydrated = useHydration()

  const sandbox = sandboxes.find((s) => s.slug === slug)
  const Component = sandbox ? sandbox.component : null

  const [exiting, setExiting] = useState(false)

  const pageTitleOpacity = !!detailSlug ? 0 : 1
  const springs = useSpring({
    from: { x: '100vw', opacity: Math.abs(pageTitleOpacity - 1) },
    to: { x: exiting ? '-100px' : '0vw', opacity: pageTitleOpacity },
    config: { mass: 3, tension: 170, friction: 26, precision: 0.0001 },
  })

  useEffect(() => {
    // Trigger 'in' transition on mount
    setTimeout(() => {
      endTransition()
    }, 1000)
  }, [endTransition])

  const handleBack = () => {
    setExiting(true)
    startTransition(sandbox?.char || '')
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }

  const mode = useAppStore((state) => state.mode)

  // Wait for hydration before rendering view-mode-dependent content
  if (!hydrated) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <div className='animate-pulse text-white/50'>Loading...</div>
      </div>
    )
  }

  // Handle not found
  if (!sandbox || !slug) {
    return (
      <div
        className={cn('w-full h-full flex items-center justify-center', mode === 'dark' ? 'text-white' : 'text-black')}
      >
        Not found
      </div>
    )
  }

  // Render 2D version if viewMode is '2d'
  if (viewMode === '2d') {
    return (
      <Generic2DPage
        title={sandbox.title}
        description={sandbox.description}
        slug={sandbox.slug}
        detailSlug={detailSlug}
        color={sandbox.color}
      />
    )
  }

  // Render 3D version (default/existing behavior)
  return (
    <>
      <div className='absolute top-10 md:top-8 left-2 md:left-8 z-[10001] pointer-events-auto'>
        <animated.button
          style={{ x: springs.x }}
          onClick={handleBack}
          className={cn(
            'cursor-pointer bg-transparent px-6 py-2 rounded-full font-bold transition-colors flex items-center gap-2',
            mode === 'dark' ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/10',
          )}
        >
          <span>←</span> Back
        </animated.button>

        <Three>
          <Suspense fallback={null}>
            <Component parentSlug={slug} detailSlug={detailSlug} />
          </Suspense>
        </Three>
      </div>

      {/* Page Overlay UI */}
      <animated.div
        style={{
          opacity: springs.x.to((x) => (x === '0vw' ? 1 : 0)),
          display: pageTitleOpacity === 0 ? 'none' : 'block',
        }}
        className={cn(
          'absolute bottom-12 left-8 z-10 pointer-events-none max-w-md transition-opacity duration-500',
          mode === 'dark' ? 'text-white' : 'text-black',
        )}
      >
        <h1 className='text-6xl font-bold mb-4 tracking-tighter'>{sandbox.title}</h1>
        <p className='text-lg opacity-80 font-light leading-relaxed'>{sandbox.description}</p>
      </animated.div>
    </>
  )
}
