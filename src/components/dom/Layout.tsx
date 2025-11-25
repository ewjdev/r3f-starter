'use client'

import { Suspense, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useSpring, animated } from '@react-spring/web'
import { useAppStore } from '@/store'
import { cn } from '@/utils'
import HamburgerNav from './HamburgerNav'

const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })

/**
 * DOM-based loading indicator for the canvas Suspense boundary.
 */
const CanvasLoadingFallback = () => (
  <div className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10'>
    <div className='w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin' />
  </div>
)
const ClickAndHold = ({
  isHolding,
  onTrigger,
  mode,
}: {
  isHolding: boolean
  onTrigger: () => void
  mode: 'light' | 'dark'
}) => {
  const { scale } = useSpring({
    scale: isHolding ? 1 : 0,
    config: { duration: isHolding ? 1350 : 350 },
    onRest: ({ finished, value }) => {
      if (finished && value.scale === 1) {
        onTrigger()
      }
    },
  })

  const color = mode === 'light' ? 'black' : 'white'

  return (
    <div className='absolute top-0 left-0 w-full h-full pointer-events-none'>
      <animated.div
        className='absolute top-0 left-0 w-full h-[10px] origin-left'
        style={{
          backgroundColor: color,
          scaleX: scale,
        }}
      />
      <div
        className={cn(
          'absolute top-2 left-1',
          mode === 'light' ? 'text-black' : 'text-white',
          isHolding ? 'opacity-100' : 'opacity-0',
        )}
      >
        Hold to toggle {mode === 'light' ? 'dark' : 'light'} mode
      </div>
    </div>
  )
}

const Layout = ({ children }) => {
  const ref = useRef(null)
  const mode = useAppStore((state) => state.mode)
  const setMode = useAppStore((state) => state.setMode)

  const [isHolding, _setIsHolding] = useState(false)
  const setIsHoldingRef = useRef<NodeJS.Timeout | null>(null)
  const setIsHolding = (value: boolean) => {
    if (setIsHoldingRef.current) {
      clearTimeout(setIsHoldingRef.current)
    }
    const d = !value ? 0 : 350
    setIsHoldingRef.current = setTimeout(() => {
      _setIsHolding(value)
    }, d)
  }

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: ' 100%',
        height: '100%',
        overflow: 'auto',
        touchAction: 'auto',
        backgroundColor: mode === 'dark' ? 'black' : 'white',
      }}
      onMouseDown={() => setIsHolding(true)}
      onMouseUp={() => setIsHolding(false)}
      onMouseLeave={() => setIsHolding(false)}
      onTouchStart={() => setIsHolding(true)}
      onTouchEnd={() => setIsHolding(false)}
    >
      <Suspense fallback={<CanvasLoadingFallback />}>
        <Scene
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
          }}
          eventSource={ref}
          eventPrefix='client'
        />
      </Suspense>
      {children}
      <HamburgerNav />
      <ClickAndHold
        isHolding={isHolding}
        onTrigger={() => {
          setMode(mode === 'light' ? 'dark' : 'light')
          _setIsHolding(false)
        }}
        mode={mode}
      />
    </div>
  )
}

export { Layout }
