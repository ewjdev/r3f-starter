'use client'

import { memo, useRef } from 'react'
import { EffectComposer, Pixelation, DepthOfField } from '@react-three/postprocessing'
import { useAppStore } from '@/store'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const Transition = memo(() => {
  const transitionState = useAppStore((state) => state.transitionState)
  // @ts-ignore
  const pixelationRef = useRef(null)
  const granularity = useRef(1)

  useFrame((state, delta) => {
    if (pixelationRef.current) {
      // Target 0 means "no pixelation" (disabled), but we interpolate to a safe value
      // We'll use 1 as the minimum "active" granularity (1 pixel size)
      const target = transitionState === 'out' ? 20 : 1

      // Smoothly interpolate using damp for frame-rate independence
      // Increasing speed to 8 makes it snappier
      granularity.current = THREE.MathUtils.damp(granularity.current, target, 2, delta)

      // Disable the effect when it's effectively at the minimum to save performance
      // and avoid any shader artifacts at low values
      if (granularity.current <= 1.05 && transitionState !== 'out') {
        pixelationRef.current.granularity = 1
        pixelationRef.current.enabled = false
        granularity.current = 1
      } else {
        pixelationRef.current.enabled = true
        pixelationRef.current.granularity = granularity.current
      }
    }
  })

  return (
    <EffectComposer enabled={true}>
      <DepthOfField focusDistance={2} focalLength={0.02} bokehScale={9} height={256} />
      <Pixelation ref={pixelationRef} granularity={1} />
    </EffectComposer>
  )
})
