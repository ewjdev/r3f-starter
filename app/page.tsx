'use client'

import { useRef, ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Text3D,
  Center,
  Preload,
  Lightformer,
  Environment,
  CameraControls,
  RenderTexture,
  ContactShadows,
  MeshTransmissionMaterial,
} from '@react-three/drei'
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier'
import * as THREE from 'three'

import Turtle from '@/sandboxes/Turtle'
import Basic from '@/sandboxes/Basic'
import PingPong from '@/sandboxes/PingPong'
import Shoe from '@/sandboxes/Shoe'
import Stencil from '@/sandboxes/Stencil'
import Rocket from '@/sandboxes/Rocket'

export default function App() {
  return (
    <div className='h-screen w-full'>
      <Canvas dpr={[1.5, 2]} camera={{ position: [-20, 40, 30], fov: 45, near: 1, far: 300 }}>
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
        {/** Environment (for reflections) */}
        <Environment files='https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr' resolution={1024}>
          {/** On top of the HDRI we add some rectangular and circular shapes for nicer reflections */}
          <group rotation={[-Math.PI / 3, 0, 0]}>
            <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
            {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
              <Lightformer
                key={i}
                form='circle'
                intensity={4}
                rotation={[Math.PI / 2, 0, 0]}
                position={[x, 4, i * 4]}
                scale={[4, 1, 1]}
              />
            ))}
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
            <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
          </group>
        </Environment>
        {/** Contact shadows for naive soft shadows */}
        <ContactShadows smooth={false} scale={100} position={[0, -5.05, 0]} blur={0.5} opacity={0.75} />
        {/** Yomotsu/camera-controls, a better replacement for OrbitControls */}
        <CameraControls makeDefault dollyToCursor minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
        {/** Makes sure everything is processed and GPU uploaded before Threejs "sees" it */}
        <Preload all />
      </Canvas>
    </div>
  )
}

interface LetterProps {
  char: string
  children?: ReactNode
  stencilBuffer?: boolean
  position?: [number, number, number]
  rotation?: [number, number, number]
}

function Letter({ char, children, stencilBuffer = false, ...props }: LetterProps) {
  const main = useRef<THREE.Group>(null)
  const contents = useRef<THREE.Group>(null)
  const events = useThree((state) => state.events)
  const controls = useThree(
    (state) => state.controls as unknown as { fitToBox: (obj: THREE.Object3D, animate: boolean) => void },
  )

  // The letters contents are moved to its whereabouts in world coordinates
  useFrame(() => {
    if (contents.current && main.current) {
      contents.current.matrix.copy(main.current.matrixWorld)
    }
  })

  return (
    /** A physics rigid body */
    <RigidBody restitution={0.1} colliders='cuboid' {...props}>
      {/** Center each letter */}
      <Center ref={main}>
        <Text3D
          bevelEnabled
          onDoubleClick={(e) => {
            e.stopPropagation()
            if (main.current && controls) controls.fitToBox(main.current, true)
          }}
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
            {/** Render a portalled scene into the "buffer" attribute of transmission material, which is a texture.
                 Since we're moving the contents with the letter shape in world space we take the standard event compute. */}
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
              {/** Everything in here is self-contained, behaves like a regular canvas, but we're *in* the texture */}
              <color attach='background' args={['#4899c9']} />
              <group ref={contents} matrixAutoUpdate={false}>
                {/** Drop the children in here, this is where the sandboxes land. */}
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
