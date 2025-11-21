'use client'

import { Image, Text, Center, Float, OrthographicCamera, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export default function AboutSandbox() {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <Center>
      <OrthographicCamera makeDefault position={[0, 0, 3]} zoom={20} />
      <group ref={group}>
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Text position={[0, 10, 0]} fontSize={1} color='white' anchorX='center' anchorY='middle'>
            About Us
          </Text>

          {/* Using available image from project */}
          <Image url='/img/scores/lighthouse.svg' scale={[4, 3]} position={[0, 8, 0]} transparent opacity={0.9} />

          <Html transform position={[0, -0.5, 0]} distanceFactor={20}>
            <div className='bg-white/90 p-6 rounded-xl shadow-2xl w-[350px] text-center backdrop-blur-sm'>
              <p className='text-white text-sm'>
                We are a creative agency building immersive web experiences that bridge the gap between imagination and
                reality.
              </p>
            </div>
          </Html>
        </Float>
      </group>
    </Center>
  )
}
