import { Suspense, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei/core'
import { Environment } from '@react-three/drei/core'
import { PivotControls } from '@react-three/drei/web'
import { BufferGeometry, Mesh } from 'three'

export default function App(props) {
  return (
    <group {...props}>
      <ambientLight intensity={0.2} />
      <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, 10]} />
      <PivotControls depthTest={false} anchor={[0, 0, 0]}>
        <Suspense fallback={null}>
          <Shoe />
        </Suspense>
      </PivotControls>
      <Environment preset='city' />
    </group>
  )
}

function Shoe() {
  const ref = useRef(null)
  const { nodes, materials } = useGLTF('/models/shoe-draco.glb')
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 2
    ref.current.rotation.set(Math.cos(t / 4) / 8, Math.sin(t / 4) / 8, -0.2 - (1 + Math.sin(t / 1.5)) / 20)
    ref.current.position.y = (1 + Math.sin(t / 4)) / 10
  })
  const shoe = nodes.shoe as Mesh
  const shoe_1 = nodes.shoe_1 as Mesh
  const shoe_2 = nodes.shoe_2 as Mesh
  const shoe_3 = nodes.shoe_3 as Mesh
  const shoe_4 = nodes.shoe_4 as Mesh
  const shoe_5 = nodes.shoe_5 as Mesh
  const shoe_6 = nodes.shoe_6 as Mesh
  const shoe_7 = nodes.shoe_7 as Mesh

  if (!shoe || !shoe_1 || !shoe_2 || !shoe_3 || !shoe_4 || !shoe_5 || !shoe_6 || !shoe_7) return null
  return (
    <group ref={ref}>
      <mesh
        receiveShadow
        castShadow
        geometry={shoe.geometry as BufferGeometry}
        material={materials.laces}
        material-color='white'
      />
      {/* <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_1.geometry}
        material={materials.mesh}
        material-color='skyblue'
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_2.geometry}
        material={materials.caps}
        material-color='skyblue'
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_3.geometry}
        material={materials.inner}
        material-color='orange'
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_4.geometry}
        material={materials.sole}
        material-color='white'
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_5.geometry}
        material={materials.stripes}
        material-color='lightblue'
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_6.geometry}
        material={materials.band}
        material-color='lightblue'
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_7.geometry}
        material={materials.patch}
        material-color='orange'
      /> */}
    </group>
  )
}
