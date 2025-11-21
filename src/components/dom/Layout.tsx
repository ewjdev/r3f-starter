'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useSpring, animated } from '@react-spring/web'
import { useAppStore } from '@/store'
import { cn } from '@/utils'
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })
type ClickAndHoldProps = {
  onClickAndHold: () => void
  mode: 'light' | 'dark'
  delay?: number
}
const ClickAndHold = ({ onClickAndHold, mode, delay = 500 }: ClickAndHoldProps) => {
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
    config: { duration: isHolding ? 1000 : 500 },
    onRest: ({ finished, value }) => {
      if (finished && value.scale === 1) {
        onClickAndHold()
        setIsHolding(false)
      }
    },
  })

  const color = mode === 'light' ? 'black' : 'white'

  return (
    <div
      className='absolute top-0 left-0 w-full h-full'
      onMouseDown={() => setIsHolding(true)}
      onMouseUp={() => setIsHolding(false)}
      onMouseLeave={() => setIsHolding(false)}
      onTouchStart={() => setIsHolding(true)}
      onTouchEnd={() => setIsHolding(false)}
    >
      <animated.div
        className='absolute top-0 left-0 w-full h-[20px] origin-left'
        style={{
          backgroundColor: color,
          scaleX: scale,
        }}
      />
      {isHolding && (
        <div className={cn('absolute top-4 left-0', mode === 'light' ? 'text-black' : 'text-white')}>
          Hold to toggle theme
        </div>
      )}
    </div>
  )
}

const Layout = ({ children }) => {
  const ref = useRef(null)
  const mode = useAppStore((state) => state.mode)
  const setMode = useAppStore((state) => state.setMode)
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
    >
      {children}
      <ClickAndHold
        onClickAndHold={() => {
          setMode(mode === 'light' ? 'dark' : 'light')
        }}
        mode={mode}
      />
      <Suspense fallback={null}>
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
    </div>
  )
}

export { Layout }
