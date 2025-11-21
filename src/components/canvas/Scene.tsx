'use client'

import { Canvas } from '@react-three/fiber'
import { Hud, Preload } from '@react-three/drei'
import { r3f } from '@/helpers/global'
import * as THREE from 'three'
import { Transition } from './Transition'
import { ui } from '@/helpers/global'

export default function Scene({ ...props }) {
  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <Canvas
      className='pointer-events-auto'
      {...props}
      dpr={[1.5, 2]}
      camera={{ position: [-20, 40, 30], fov: 45, near: 1, far: 60 }}
    >
      {/* @ts-ignore */}
      <Transition />
      <r3f.Out />
      <Hud renderPriority={2}>
        <ui.Out />
      </Hud>
      <Preload all />
    </Canvas>
  )
}
