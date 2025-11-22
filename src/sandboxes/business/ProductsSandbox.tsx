'use client'

import { useGLTF, Float, OrthographicCamera, ScrollControls, useScroll, Text as DreiText } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Suspense, useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { Root, Container, Text } from '@react-three/uikit'
import { GLTF } from 'three-stdlib'

// Increase item count to test performance, but stick to the requirement
const ITEMS_PER_PAGE = 3
const PRODUCTS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  name: `Air Max ${i + 1}`,
  price: 199 + i * 20,
  model: '/models/shoe-draco.glb',
  color: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#1a535c', '#ff9f1c'][i % 5],
  url: `https://example.com/buy/${i}`,
  description: ['Lightweight comfort', 'Maximum bounce', 'Urban style', 'Pro performance', 'Limited edition'][i % 5],
}))

const TOTAL_PAGES = Math.ceil(PRODUCTS.length / ITEMS_PER_PAGE)

// Re-use geometry and material clones to avoid cloning per frame or per mount if possible
// But we need per-color materials.
// Optimization: Componentize the model to use `useGLTF` efficiently with instances if possible,
// but given we change colors, we still need unique materials.
// Major performance bottleneck is likely re-rendering React components on every frame if state changes
// or heavy logic in useFrame.

// Check if `activePage` state causes full re-renders.
// In `ProductScene`, `setActivePage` is called in `useFrame`. This triggers a React re-render 60fps!
// This is the main performance killer. We should NOT store scroll progress in React state.
// We should pass a mutable ref or access `scroll.offset` directly in child components' `useFrame`.

function ProductItem({
  index,
  data,
  scrollData,
}: {
  index: number
  data: (typeof PRODUCTS)[0]
  scrollData: { current: number }
}) {
  const group = useRef<THREE.Group>(null)
  const { scene } = useGLTF(data.model) as any
  const [hovered, setHovered] = useState(false)

  // Memoize the cloned scene to prevent recreation
  const clonedScene = useMemo(() => {
    const clone = scene.clone()
    clone.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.material = (mesh.material as THREE.Material).clone()
        ;(mesh.material as THREE.MeshStandardMaterial).color?.set(data.color)
      }
    })
    return clone
  }, [scene, data.color])

  const itemPage = Math.floor(index / ITEMS_PER_PAGE)
  const positionInPage = index % ITEMS_PER_PAGE
  const baseX = (positionInPage - 1) * 5

  // Use local ref for animation state to avoid React state updates
  useFrame((state, delta) => {
    if (!group.current) return

    // Read scroll position directly from the shared ref object updated by parent
    // This avoids passing props that change every frame
    const activePage = scrollData.current
    const dist = activePage - itemPage

    const targetY = dist * 15

    // Lerp for smooth movement
    group.current.position.x = baseX
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.1)

    // Scale logic
    const s = Math.max(0, 1 - Math.abs(dist))
    const targetScale = s * 3.5

    // Smooth scale transition
    group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

    // Rotate
    group.current.rotation.y = Math.sin(state.clock.elapsedTime + index) * 0.1 + Math.PI / 4

    // Optimization: Toggle visibility to skip rendering if far off screen
    group.current.visible = s > 0.01
  })

  return (
    <group ref={group} position={[baseX, -20, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <primitive object={clonedScene} />
      </Float>

      <group position={[0, 3, 0]}>
        <Root pixelSize={0.01} sizeX={4} flexDirection='column' alignItems='center' justifyContent='center'>
          <Text fontSize={32} color={new THREE.Color(data.color)} fontWeight='bold' fontFamily='Inter, sans-serif'>
            {data.name}
          </Text>
          <Text fontSize={20} color='white' opacity={0.8} marginTop={4} fontFamily='Inter, sans-serif'>
            ${data.price}
          </Text>
        </Root>
      </group>

      <group position={[0, -2, 0]}>
        <Root pixelSize={0.01}>
          <Container
            paddingLeft={24}
            paddingRight={24}
            paddingTop={12}
            paddingBottom={12}
            backgroundColor={hovered ? '#4d4d52' : '#333338'}
            borderRadius={100}
            borderColor='#4d4d52'
            borderWidth={1}
            cursor='pointer'
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onClick={(e) => {
              e.stopPropagation()
              window.open(data.url, '_blank')
            }}
            alignItems='center'
            justifyContent='center'
          >
            <Text color='white' fontSize={14} fontWeight='medium' fontFamily='Inter, sans-serif'>
              Buy Now
            </Text>
          </Container>
        </Root>
      </group>
    </group>
  )
}

function ProductScene() {
  const scroll = useScroll()
  // Use a ref to store the current page value without triggering re-renders
  const scrollData = useRef({ current: 0 })

  useFrame(() => {
    // Update the ref value every frame
    scrollData.current.current = scroll.offset * (TOTAL_PAGES - 1)
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />

      {PRODUCTS.map((product, index) => (
        <ProductItem key={product.id} index={index} data={product} scrollData={scrollData.current} />
      ))}
    </>
  )
}

export default function ProductsSandbox() {
  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={15} />

      <Suspense fallback={null}>
        <ScrollControls pages={TOTAL_PAGES} damping={0.2} style={{ pointerEvents: 'auto' }}>
          <ProductScene />
        </ScrollControls>
      </Suspense>
    </>
  )
}
