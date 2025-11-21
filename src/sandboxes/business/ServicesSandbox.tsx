'use client'

import { Float, Text, Center, MeshDistortMaterial, OrthographicCamera } from '@react-three/drei'

export default function ServicesSandbox() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <OrthographicCamera makeDefault position={[0, 0, 2]} zoom={20} />
      <Center>
        <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1} position={[0, 0.5, 1]}>
          <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <MeshDistortMaterial color='#ffe66d' speed={3} distort={0.3} />
          </mesh>
          <Text position={[0, -1.5, 0]} fontSize={0.4} color='white' anchorX='center'>
            Development
          </Text>
        </Float>

        <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1} position={[3, 0, 0]}>
          <mesh>
            <torusKnotGeometry args={[0.8, 0.3, 100, 16]} />
            <MeshDistortMaterial color='#1a535c' speed={1.5} distort={0.2} />
          </mesh>
          <Text position={[0, -1.5, 0]} fontSize={0.4} color='white' anchorX='center'>
            Strategy
          </Text>
        </Float>
      </Center>
    </>
  )
}
