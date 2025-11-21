'use client'

import { useGLTF, Float, Stage, Text, OrthographicCamera } from '@react-three/drei'
import { Suspense } from 'react'

export default function ProductsSandbox() {
  // Using one of the existing models
  // Note: Ensure the path is correct relative to public folder
  const { scene } = useGLTF('/models/shoe-draco.glb')

  return (
    <>
      <Text position={[0, 3, -2]} fontSize={1} color='#ffe66d' anchorX='center'>
        Featured Product
      </Text>
      <OrthographicCamera makeDefault position={[0, 0, 3]} zoom={10} />
      <Suspense fallback={null}>
        <Stage environment='city' intensity={0.5} adjustCamera={false}>
          <Float speed={2} rotationIntensity={3} floatIntensity={2}>
            <primitive object={scene} scale={4} rotation={[0, Math.PI / 4, 0]} />
          </Float>
        </Stage>
      </Suspense>
      <Text position={[0, -4, 0]} fontSize={1} color='white' anchorX='center'>
        Air Max 3D - $199
      </Text>
    </>
  )
}
