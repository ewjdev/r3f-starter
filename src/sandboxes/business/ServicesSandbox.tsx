'use client'

import { useRef, useState, ReactNode } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Float, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

const services = [
  {
    title: 'Web Development',
    description: 'Building scalable, performant, and accessible web applications using modern technologies.',
    color: '#ffe66d',
  },
  {
    title: 'Digital Strategy',
    description: 'Crafting data-driven strategies to grow your business and reach your target audience effectively.',
    color: '#1a535c',
  },
  {
    title: 'UI/UX Design',
    description: 'Designing intuitive and engaging user interfaces that provide exceptional user experiences.',
    color: '#ff6b6b',
  },
]

const Section = ({ index, children }: { index: number; children: ReactNode }) => {
  const { size } = useThree()
  return (
    <section
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 15px',
        pointerEvents: 'none', // Let clicks pass through to canvas if needed
      }}
    >
      <div className='w-2/3 sm:w-1/2' style={{ pointerEvents: 'auto' }}>
        {children}
      </div>
    </section>
  )
}

function Scene() {
  const scroll = useScroll()
  const camera = useThree((state) => state.camera)

  useFrame((state, delta) => {
    // Move camera along a path based on scroll offset
    // scroll.offset is between 0 and 1
    const offset = scroll.offset

    // Calculate target position
    // We have 3 sections.
    // Section 1: camera around z=5
    // Section 2: camera around z=5 - 10 = -5
    // Section 3: camera around z=5 - 20 = -15

    const targetZ = 5 - offset * 20 // Adjust multiplier to match spacing

    // Smoothly interpolate camera position
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.1)

    // Optional: Add some slight mouse parallax or rotation
  })

  return (
    <>
      {/* Service 1 Visual */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1} position={[2, 0, 0]}>
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <MeshDistortMaterial color={services[0].color} speed={2} distort={0.4} />
        </mesh>
      </Float>

      {/* Service 2 Visual */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1} position={[-2, 0, -10]}>
        <mesh>
          <torusKnotGeometry args={[1, 0.3, 100, 16]} />
          <MeshDistortMaterial color={services[1].color} speed={2} distort={0.3} />
        </mesh>
      </Float>

      {/* Service 3 Visual */}
      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1} position={[2, 0, -20]}>
        <mesh>
          <octahedronGeometry args={[1.5]} />
          <MeshDistortMaterial color={services[2].color} speed={2} distort={0.5} />
        </mesh>
      </Float>
    </>
  )
}

export default function ServicesSandbox() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

      <ScrollControls pages={3} damping={0.3} style={{ pointerEvents: 'auto' }}>
        <Scene />
        <Scroll html style={{ width: '100%', height: '100%' }}>
          {services.map((service, i) => (
            <Section key={i} index={i}>
              <h2 className='text-4xl font-bold mb-4' style={{ color: service.color }}>
                {service.title}
              </h2>
              <p className='text-xl text-gray-200'>{service.description}</p>
            </Section>
          ))}
        </Scroll>
      </ScrollControls>
    </>
  )
}
