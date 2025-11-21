'use client'

import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { useSpring, animated } from '@react-spring/web'

export default function Loading() {
  const { progress } = useProgress()
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => setShow(false), 500)
      return () => clearTimeout(timer)
    } else {
      setShow(true)
    }
  }, [progress])

  const { opacity } = useSpring({
    opacity: show ? 1 : 0,
    config: { tension: 280, friction: 60 },
  })

  const { width } = useSpring({
    width: progress,
    config: { tension: 280, friction: 60 },
  })

  return (
    <animated.div
      style={{ opacity, pointerEvents: show ? 'auto' : 'none', display: show ? 'flex' : 'none' }}
      className='fixed inset-0 z-10000 flex flex-col items-center justify-center bg-black'
    >
      <div className='relative h-2 w-64 overflow-hidden rounded bg-gray-800'>
        <animated.div className='absolute left-0 top-0 h-full bg-white' style={{ width: width.to((w) => `${w}%`) }} />
      </div>
      <animated.div className='mt-4 font-stack text-sm text-white'>
        {width.to((w) => `Loading ${Math.round(w)}%`)}
      </animated.div>
    </animated.div>
  )
}
