'use client'

import { memo, useRef, useEffect, use } from 'react'
import { EffectComposer, Pixelation, DepthOfField } from '@react-three/postprocessing'
import { useAppStore } from '@/store'
import { useFrame } from '@react-three/fiber'
import { useSpring } from '@react-spring/three'
import { useParams } from 'next/navigation'

/**
 * Configuration for the Transition effect.
 * Tweak these values to adjust the feel and performance of the animation.
 */
const TRANSITION_CONFIG = {
  // Target granularity when transition is active (pixelated)
  activeTarget: 20,
  // Target granularity when transition is inactive (clear)
  inactiveTarget: 0,
  // Threshold below which the effect is disabled entirely for performance
  disableThreshold: 1.05,
  delay: 2500,
  // Spring physics configuration
  spring: {
    mass: 1,
    tension: 180,
    friction: 30,
    precision: 0.001,
  },
  // Enable to log transition states and values
  debug: false,
}

export const Transition = memo(({ children }: { children: React.ReactNode }) => {
  const transitionState = useAppStore((state) => state.transitionState)
  const { id } = useParams<{ id: string }>()
  const isSubPage = !!id
  console.log({ isSubPage, id })
  // @ts-ignore
  const pixelationRef = useRef(null)

  const isTransitingOut = transitionState === 'out'

  // Debugging
  useEffect(() => {
    if (TRANSITION_CONFIG.debug) {
      console.log('[Transition] State changed:', transitionState)
    }
  }, [transitionState])

  const { granularity } = useSpring({
    granularity: isTransitingOut ? TRANSITION_CONFIG.activeTarget : TRANSITION_CONFIG.inactiveTarget,
    config: TRANSITION_CONFIG.spring,
  })

  useFrame(() => {
    if (pixelationRef.current) {
      const currentGranularity = granularity.get()

      // Performance optimization: Disable the effect when close to 1 (or 0)
      // This saves GPU resources on mobile when the effect isn't visible
      if (currentGranularity < TRANSITION_CONFIG.disableThreshold && !isTransitingOut) {
        if (pixelationRef.current.enabled) {
          pixelationRef.current.enabled = false
          pixelationRef.current.granularity = 1
          if (TRANSITION_CONFIG.debug) console.log('[Transition] Effect disabled')
        }
      } else {
        if (!pixelationRef.current.enabled) {
          pixelationRef.current.enabled = true
          if (TRANSITION_CONFIG.debug) console.log('[Transition] Effect enabled')
        }
        // Ensure minimum granularity is 1 to avoid invalid values if the effect doesn't handle 0
        pixelationRef.current.granularity = Math.max(1, currentGranularity)
      }
    }
  })

  return (
    <EffectComposer autoClear={false}>
      {!isSubPage && !isTransitingOut && (
        <DepthOfField focusDistance={30} focalLength={0.01} bokehScale={8} height={256} />
      )}
      <Pixelation ref={pixelationRef} granularity={0} />
    </EffectComposer>
  )
})
