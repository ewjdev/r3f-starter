'use client'

import { Suspense, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useAppStore } from '@/store'
import { Three } from '@/helpers/components/Three'
// import { Three } from '@/helpers/components/Three'
// import { useAppStore } from '@/store'
// import { PerspectiveCamera, Environment, CameraControls } from '@react-three/drei'

// Dynamic imports for sandboxes
const Turtle = dynamic(() => import('@/sandboxes/Turtle'))
const Basic = dynamic(() => import('@/sandboxes/Basic'))
const PingPong = dynamic(() => import('@/sandboxes/PingPong'))
const Shoe = dynamic(() => import('@/sandboxes/Shoe'))
const Stencil = dynamic(() => import('@/sandboxes/Stencil'))
const Rocket = dynamic(() => import('@/sandboxes/Rocket'))

const Components = {
  s: Shoe,
  t: Rocket, // Mapping first T to Rocket
  a: Basic,
  r: PingPong, // Mapping first R to PingPong
  e: Stencil,
}

export default function LetterPage() {
  const { id } = useParams()
  const router = useRouter()
  const endTransition = useAppStore((state) => state.endTransition)
  const startTransition = useAppStore((state) => state.startTransition)

  const letter = Array.isArray(id) ? id[0] : id
  const Component = Components[letter?.toLowerCase() as keyof typeof Components] || Basic

  useEffect(() => {
    // Trigger 'in' transition on mount
    setTimeout(() => {
      endTransition()
    }, 1000)
  }, [endTransition])

  const handleBack = () => {
    startTransition(null)
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }

  return (
    <>
      <div className='absolute top-8 left-8 z-100 pointer-events-auto'>
        <button
          onClick={handleBack}
          className='cursor-pointer bg-white/90 backdrop-blur-sm text-black px-6 py-2 rounded-full font-bold transition-colors'
        >
          ← Back
        </button>

        <Three>
          <Suspense fallback={null}>
            <Component />
          </Suspense>
        </Three>
      </div>
    </>
  )
}
