'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Lightweight 3D loading spinner for Suspense fallbacks.
 * Renders a rotating ring that indicates loading state.
 */
export function LoadingFallback() {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 2
    }
  })

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[0.5, 0.08, 8, 32]} />
      <meshBasicMaterial color="#888888" transparent opacity={0.6} />
    </mesh>
  )
}

/**
 * Simple placeholder for product items while loading.
 */
export function ProductLoadingPlaceholder() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#444444" wireframe />
      </mesh>
    </group>
  )
}

