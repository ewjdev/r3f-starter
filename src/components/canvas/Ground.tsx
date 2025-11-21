import { useAppStore } from '@/store'
import { MeshReflectorMaterial, useTexture } from '@react-three/drei'
import { memo } from 'react'
import * as THREE from 'three'

const Ground = memo(function Ground() {
  const mode = useAppStore((state) => state.mode)
  const [floor, normal] = useTexture(['/SurfaceImperfections003_1K_var1.jpg', '/SurfaceImperfections003_1K_Normal.jpg'])
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -6, 0]}>
      <planeGeometry args={[300, 300]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={512}
        mixBlur={0.5}
        mixStrength={1.5}
        roughness={mode === 'dark' ? 0.2 : 1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color={mode === 'dark' ? '#000000' : 'white'}
        opacity={mode === 'dark' ? 1 : 0}
        transparent
        metalness={mode === 'dark' ? 0.4 : 0}
        map={floor}
        normalMap={normal}
        normalMapType={THREE.TangentSpaceNormalMap}
        normalScale={[2, 2]}
      />
    </mesh>
  )
})

export default Ground
