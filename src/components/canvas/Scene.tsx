'use client'

import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { r3f } from '@/helpers/global'
import { Transition } from './Transition'
import { ui } from '@/helpers/global'

export default function Scene({ ...props }) {
  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <>
      <Canvas
        className='pointer-events-auto'
        {...props}
        // Lower min DPR from 1.5 to 1 for better mobile performance
        // Max stays at 2 for crisp rendering on high-DPI displays
        dpr={[1, 2]}
        camera={{ position: [-20, 35, 30], fov: 45, near: 1, far: 60 }}
      >
        {/* @ts-ignore */}
        <Transition />
        <r3f.Out />
        <Preload all />
      </Canvas>
      <ui.Out />
    </>
  )
}
