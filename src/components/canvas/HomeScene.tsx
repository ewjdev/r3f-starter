'use client'

import { PerspectiveCamera, Lightformer, Environment, CameraControls, ContactShadows, Preload } from '@react-three/drei'
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier'
import { Letter } from './Letter'

import Turtle from '@/sandboxes/Turtle'
import Basic from '@/sandboxes/Basic'
import PingPong from '@/sandboxes/PingPong'
import Shoe from '@/sandboxes/Shoe'
import Stencil from '@/sandboxes/Stencil'
import Rocket from '@/sandboxes/Rocket'
import { useAppStore } from '@/store'
import { Suspense, useEffect, useRef } from 'react'
import { MeshBasicMaterial } from 'three'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function HomeScene() {
  const resetTransition = useAppStore((state) => state.resetTransition)
  const mode = useAppStore((state) => state.mode)
  useEffect(() => {
    setTimeout(() => {
      resetTransition()
    }, 2500)
  }, [resetTransition])
  const materialRef = useRef<MeshBasicMaterial>(null)
  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.color = new THREE.Color(mode === 'dark' ? 'black' : 'white')
      materialRef.current.opacity = mode === 'dark' ? 1 : 0
    }
  })
  return (
    <>
      <PerspectiveCamera makeDefault position={[-20, 40, 30]} fov={45} near={1} far={300} />

      {/** The physics world */}
      <Physics gravity={[0, -60, 0]}>
        <Letter char='S' position={[2, 60, -2]} rotation={[4, 5, 6]}>
          <Shoe scale={5} />
        </Letter>
        <Letter char='T' position={[3, 70, 2]} rotation={[7, 8, 9]}>
          <Rocket position={[-1, -1, 0]} scale={0.6} />
        </Letter>
        <Letter char='A' position={[-1, 80, 3]} rotation={[10, 11, 12]}>
          <Basic scale={3} />
        </Letter>
        <Letter char='R' position={[-2, 90, 2]} rotation={[13, 14, 15]}>
          <PingPong />
        </Letter>
        <Letter char='T' position={[-3, 100, -3]} rotation={[16, 17, 18]} stencilBuffer>
          <Stencil scale={1} />
        </Letter>
        <Letter char='E' position={[-3, 100, -3]} rotation={[16, 17, 18]}>
          <Stencil scale={1} />
        </Letter>
        <Letter char='R' position={[-3, 100, -3]} rotation={[16, 17, 18]}>
          <Stencil scale={3} />
        </Letter>
        {/** Invisible walls */}
        <RigidBody type='fixed'>
          <CuboidCollider position={[0, -6, 0]} args={[100, 1, 100]} />
          <CuboidCollider position={[0, 0, -30]} args={[30, 100, 1]} />
          <CuboidCollider position={[0, 0, 10]} args={[30, 100, 1]} />
          <CuboidCollider position={[-30, 0, 0]} args={[1, 100, 30]} />
          <CuboidCollider position={[30, 0, 0]} args={[1, 100, 30]} />
        </RigidBody>
      </Physics>

      <mesh rotation-x={-Math.PI / 2} position={[0, -6, 0]}>
        <planeGeometry args={[300, 300]} />
        <meshBasicMaterial ref={materialRef} transparent />
      </mesh>
      {/** Environment (for reflections) */}
      <Suspense>
        <Environment
          files='https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rogland_clear_night_1k.hdr'
          resolution={512}
        >
          {/** On top of the HDRI we add some rectangular and circular shapes for nicer reflections */}
          <group rotation={[-Math.PI / 3, 0, 0]}>
            <Lightformer
              intensity={mode === 'dark' ? 2 : 0}
              rotation-x={Math.PI / 2}
              position={[0, 5, -9]}
              scale={[10, 10, 1]}
            />
            {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
              <Lightformer
                key={i}
                form='circle'
                intensity={mode === 'dark' ? 2 : 0}
                rotation={[Math.PI / 2, 0, 0]}
                position={[x, 4, i * 4]}
                scale={[4, 1, 1]}
              />
            ))}
            <Lightformer
              intensity={mode === 'dark' ? 2 : 0}
              rotation-y={Math.PI / 2}
              position={[-5, 1, -1]}
              scale={[50, 2, 1]}
            />
            <Lightformer
              intensity={mode === 'dark' ? 2 : 0}
              rotation-y={-Math.PI / 2}
              position={[10, 1, 0]}
              scale={[50, 2, 1]}
            />
          </group>
        </Environment>
      </Suspense>

      {/** Contact shadows for naive soft shadows */}
      <ContactShadows
        smooth={true}
        scale={100}
        position={[0, -5.05, 0]}
        blur={0.2}
        opacity={mode === 'dark' ? 0.25 : 0.75}
      />

      {/** Yomotsu/camera-controls, a better replacement for OrbitControls */}
      <CameraControls makeDefault dollyToCursor minPolarAngle={0} maxPolarAngle={Math.PI / 2} />

      {/** Makes sure everything is processed and GPU uploaded before Threejs "sees" it */}
      <Preload all />
    </>
  )
}
