'use client'

import { Suspense, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useSpring, animated } from '@react-spring/web'
import { useAppStore } from '@/store'
import { cn } from '@/utils'
import HamburgerNav from './HamburgerNav'

const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })

type ClickAndHoldProps = {
  onClickAndHold: () => void
  mode: 'light' | 'dark'
  delay?: number
}

const ClickAndHold = ({ onClickAndHold, mode, delay = 350 }: ClickAndHoldProps) => {
  const [isHolding, _setIsHolding] = useState(false)
  const setIsHoldingRef = useRef<NodeJS.Timeout | null>(null)
  const setIsHolding = (value: boolean) => {
    if (setIsHoldingRef.current) {
      clearTimeout(setIsHoldingRef.current)
    }
    let d = !value ? 0 : delay
    setIsHoldingRef.current = setTimeout(() => {
      _setIsHolding(value)
    }, d)
  }
  const { scale } = useSpring({
    scale: isHolding ? 1 : 0,
    config: { duration: isHolding ? 1350 : 350 },
    onRest: ({ finished, value }) => {
      if (finished && value.scale === 1) {
        onClickAndHold()
        setIsHolding(false)
      }
    },
  })

  const color = mode === 'light' ? 'black' : 'white'

  return (
    <div className='absolute top-0 left-0 w-full h-full touch-none pointer-events-none' style={{ zIndex: 9999 }}>
      <div
        className='absolute top-0 left-0 w-32 h-16 pointer-events-auto'
        onMouseDown={() => setIsHolding(true)}
        onMouseUp={() => setIsHolding(false)}
        onMouseLeave={() => setIsHolding(false)}
        onTouchStart={() => setIsHolding(true)}
        onTouchEnd={() => setIsHolding(false)}
      >
        <animated.div
          className='absolute top-0 left-0 w-full h-[4px] origin-left'
          style={{
            backgroundColor: color,
            scaleX: scale,
          }}
        />
        <div
          className={cn(
            'absolute top-1 left-1 text-xs transition-opacity duration-200',
            mode === 'light' ? 'text-black' : 'text-white',
            isHolding ? 'opacity-100' : 'opacity-0',
          )}
        >
          Hold for {mode === 'light' ? 'dark' : 'light'} mode
        </div>
      </div>
    </div>
  )
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null)
  const mode = useAppStore((state) => state.mode)
  const setMode = useAppStore((state) => state.setMode)
  const viewMode = useAppStore((state) => state.viewMode)

  // Hide 3D scene in 2D mode but keep it mounted to preserve WebGL context
  const hide3DScene = viewMode === '2d'

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        touchAction: 'auto',
        backgroundColor: mode === 'dark' ? 'black' : 'white',
      }}
    >
      {children}

      {/* Hamburger Navigation (includes view mode toggle) */}
      <HamburgerNav />

      {/* Light/Dark mode toggle */}
      <ClickAndHold
        onClickAndHold={() => {
          setMode(mode === 'light' ? 'dark' : 'light')
        }}
        mode={mode}
      />

      {/* 3D Scene - always mounted but hidden in 2D mode to preserve WebGL context */}
      <Suspense fallback={null}>
        <Scene
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            visibility: hide3DScene ? 'hidden' : 'visible',
            opacity: hide3DScene ? 0 : 1,
          }}
          eventSource={ref}
          eventPrefix='client'
        />
      </Suspense>
    </div>
  )
}

export { Layout }
