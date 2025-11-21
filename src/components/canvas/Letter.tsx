'use client'

import { useRef, ReactNode } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text3D, Center, RenderTexture, MeshTransmissionMaterial, Preload } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store'
import { CameraControls } from '@react-three/drei/web'

interface LetterProps {
  char: string
  children?: ReactNode
  stencilBuffer?: boolean
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export function Letter({ char, children, stencilBuffer = false, ...props }: LetterProps) {
  const main = useRef<THREE.Group>(null)
  const contents = useRef<THREE.Group>(null)
  const events = useThree((state) => state.events)
  const controls = useThree((state) => state.controls as CameraControls)
  const router = useRouter()
  const startTransition = useAppStore((state) => state.startTransition)

  useFrame(() => {
    if (contents.current && main.current) {
      contents.current.matrix.copy(main.current.matrixWorld)
    }
  })

  const handleClick = async (e: any) => {
    e.stopPropagation()
    // Trigger transition out

    startTransition(char)

    if (main.current && controls) {
      await controls.fitToBox(main.current, true, { paddingLeft: 2 })
      router.push(`/space/${char.toLowerCase()}`)
    } else {
      setTimeout(() => {
        router.push(`/space/${char.toLowerCase()}`)
      }, 500)
    }
  }

  return (
    <RigidBody restitution={0.1} colliders='cuboid' {...props}>
      <Center ref={main}>
        <Text3D
          bevelEnabled
          onClick={handleClick}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'default')}
          font='https://threejs.org/examples/fonts/helvetiker_bold.typeface.json'
          smooth={1}
          scale={0.125}
          size={80}
          height={4}
          curveSegments={10}
          bevelThickness={10}
          bevelSize={2}
          bevelOffset={0}
          bevelSegments={5}
        >
          {char}
          <MeshTransmissionMaterial
            clearcoat={1}
            samples={3}
            thickness={40}
            chromaticAberration={0.25}
            anisotropy={0.4}
          >
            <RenderTexture
              attach='buffer'
              stencilBuffer={stencilBuffer}
              width={512}
              height={512}
              compute={(event, state, previous) => {
                if (events.compute) {
                  events.compute(event, state, previous)
                }
                return false
              }}
            >
              <color attach='background' args={['#4899c9']} />
              <group ref={contents} matrixAutoUpdate={false}>
                {children}
              </group>
              <Preload all />
            </RenderTexture>
          </MeshTransmissionMaterial>
        </Text3D>
      </Center>
    </RigidBody>
  )
}
