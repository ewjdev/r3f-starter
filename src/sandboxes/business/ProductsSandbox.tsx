'use client'

import { useGLTF, Float, OrthographicCamera, ScrollControls, useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Suspense, useMemo, useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import { Root, Container, Text } from '@react-three/uikit'
import { useAppStore } from '@/store'

// Increase item count to test performance, but stick to the requirement
const ITEMS_PER_PAGE = 3
const createProductSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const PRODUCTS = Array.from({ length: 10 }, (_, i) => {
  const name = `Air Max ${i + 1}`

  return {
    id: i,
    name,
    slug: createProductSlug(name),
    price: 199 + i * 20,
    model: '/models/shoe-draco.glb',
    color: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#1a535c', '#ff9f1c'][i % 5],
    url: `https://example.com/buy/${i}`,
    description: [
      'Lightweight comfort met with iconic design.',
      'Maximum bounce for your daily run.',
      'Urban style redefined for the modern era.',
      'Pro performance for serious athletes.',
      'Limited edition colorway for collectors.',
    ][i % 5],
    details: ['Breathable mesh upper', 'Responsive cushioning', 'Durable rubber outsole', 'Sustainable materials'],
  }
})

const PRODUCT_BY_SLUG = new Map(PRODUCTS.map((product) => [product.slug, product]))

const LIST_PAGES = Math.ceil(PRODUCTS.length / ITEMS_PER_PAGE)
const DETAIL_PAGES = 4 // Pages for scrolling through details

type ProductTheme = {
  textPrimary: string
  textSecondary: string
  mutedText: string
  ghostButtonBg: string
  ghostButtonHoverBg: string
  ghostButtonBorder: string
  ghostButtonText: string
  chipBg: string
  chipHoverBg: string
  chipBorder: string
}

const PRODUCT_THEMES: Record<'light' | 'dark', ProductTheme> = {
  light: {
    textPrimary: '#0f1115',
    textSecondary: '#4b4d57',
    mutedText: '#6c6f7d',
    ghostButtonBg: '#f0f2f8',
    ghostButtonHoverBg: '#e1e4ee',
    ghostButtonBorder: 'rgba(15,17,21,0.12)',
    ghostButtonText: '#0f1115',
    chipBg: '#ffffff',
    chipHoverBg: '#f1f3f9',
    chipBorder: 'rgba(15,17,21,0.14)',
  },
  dark: {
    textPrimary: '#f7f8fb',
    textSecondary: 'rgba(247,248,251,0.82)',
    mutedText: '#b3b6c4',
    ghostButtonBg: '#333338',
    ghostButtonHoverBg: '#4d4d52',
    ghostButtonBorder: 'rgba(247,248,251,0.18)',
    ghostButtonText: '#f7f7fb',
    chipBg: '#2b2b34',
    chipHoverBg: '#3a3a45',
    chipBorder: 'rgba(247,248,251,0.18)',
  },
}

const getReadableTextColor = (hexColor: string) => {
  const color = new THREE.Color(hexColor)
  const luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b
  return luminance > 0.55 ? '#0b0d12' : '#f7f8fb'
}

const sineSnap = (value: number) => value - Math.sin(value * Math.PI * 2) / (Math.PI * 1.5)
const magneticSnap = (value: number, maxPage: number, strength = 0.85) => {
  const nearest = THREE.MathUtils.clamp(Math.round(value), 0, maxPage)
  return THREE.MathUtils.lerp(value, nearest, strength)
}

function ScrollHandler({ selectedId }: { selectedId: number | null }) {
  const scroll = useScroll()
  const lastSelectedId = useRef(selectedId)
  const lastListScroll = useRef(0)

  useLayoutEffect(() => {
    // Transitioning TO Detail View
    if (selectedId !== null && lastSelectedId.current === null) {
      lastListScroll.current = scroll.offset
      scroll.el.scrollTop = 0
    }
    // Transitioning BACK to List View
    else if (selectedId === null && lastSelectedId.current !== null) {
      // We need to restore the scroll position relative to the new page height
      // The 'pages' prop on ScrollControls will update, changing the scrollHeight
      // We must wait for that update (which happens in React render cycle)
      // requestAnimationFrame ensures we run after the DOM update
      const savedOffset = lastListScroll.current
      requestAnimationFrame(() => {
        const newMaxScroll = scroll.el.scrollHeight - scroll.el.clientHeight
        scroll.el.scrollTop = savedOffset * newMaxScroll
      })
    }

    lastSelectedId.current = selectedId
  }, [selectedId, scroll])

  return null
}

function ProductItem({
  index,
  data,
  scrollData,
  selectedId,
  onSelect,
  theme,
}: {
  index: number
  data: (typeof PRODUCTS)[0]
  scrollData: { current: number }
  selectedId: number | null
  onSelect: (id: number) => void
  theme: ProductTheme
}) {
  const group = useRef<THREE.Group>(null)
  const { scene } = useGLTF(data.model) as any
  const [hovered, setHovered] = useState(false)
  const { width, height } = useThree((state) => state.viewport)

  // Memoize the cloned scene
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
  const horizontalSpacing = width / (ITEMS_PER_PAGE + 1)
  const baseX = (positionInPage - 1) * horizontalSpacing

  useFrame((state, delta) => {
    if (!group.current) return

    const isSelected = selectedId === data.id
    const isAnySelected = selectedId !== null
    // Simple mobile check based on viewport width or window width
    const isMobile = window.innerWidth < 600

    if (isSelected) {
      // DETAIL MODE: Center the product
      const scroll = scrollData.current

      // Animate Product Position based on scroll
      // Index 0 (Start): Bottom (-height * 0.15)
      // Index >= 1 (Details): Top (height * 0.25)
      const scrollProgress = THREE.MathUtils.clamp(scroll, 0, 1)
      const mobileY = THREE.MathUtils.lerp(-height * 0.2, height * 0.15, scrollProgress)

      const targetY = isMobile ? mobileY : 0

      // Use a responsive offset. If width is small (mobile), maybe center or slightly up.
      // For now, stick to left side but closer to center.
      const targetX = !isMobile ? -width * 0.2 : -3

      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.1)
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.1)

      // Scale up
      const targetScale = 5.5
      group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

      // Rotate slowly
      group.current.rotation.y += delta * 0.5

      group.current.visible = true
    } else if (isAnySelected) {
      // OTHER PRODUCTS: Move away/fade out
      group.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1)
      if (group.current.scale.x < 0.1) group.current.visible = false
    } else {
      // LIST MODE: Original logic
      const activePage = scrollData.current
      const dist = activePage - itemPage
      const targetY = dist * (height * 1.2)

      group.current.position.x = baseX
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.1)

      const s = Math.max(0, 1 - Math.abs(dist) * 1.5)
      const targetScale = s * 3.5
      group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

      group.current.rotation.y = Math.sin(state.clock.elapsedTime + index) * 0.1 + Math.PI / 4

      group.current.visible = s > 0.01
    }
  })

  // Don't show "Buy Now" button in detail mode (we'll add a different UI)
  const showButton = selectedId === null

  return (
    <group ref={group} position={[baseX, -20, 0]}>
      <Float speed={selectedId === data.id ? 0.5 : 2} rotationIntensity={0.5} floatIntensity={0.5}>
        <primitive object={clonedScene} />
      </Float>

      {/* Product Name & Price - Hide in detail mode, we will show it differently */}
      <group position={[0, 3, 0]} scale={showButton ? 1 : 0}>
        <Root pixelSize={0.01} sizeX={4} flexDirection='column' alignItems='center' justifyContent='center'>
          <Text fontSize={32} color={new THREE.Color(data.color)} fontWeight='bold'>
            {data.name}
          </Text>
          <Text fontSize={20} color={theme.textSecondary} opacity={0.9} marginTop={4}>
            ${data.price}
          </Text>
        </Root>
      </group>

      {/* Buy Now Button */}
      {showButton && (
        <group position={[0, -2, 0]}>
          <Root pixelSize={0.01}>
            <Container
              paddingLeft={24}
              paddingRight={24}
              paddingTop={12}
              paddingBottom={12}
              backgroundColor={hovered ? theme.ghostButtonHoverBg : theme.ghostButtonBg}
              borderRadius={100}
              borderColor={theme.ghostButtonBorder}
              borderWidth={1}
              cursor='pointer'
              onPointerEnter={() => setHovered(true)}
              onPointerLeave={() => setHovered(false)}
              onClick={(e) => {
                e.stopPropagation()
                onSelect(data.id)
              }}
              alignItems='center'
              justifyContent='center'
            >
              <Text color={theme.ghostButtonText} fontSize={14} fontWeight='medium'>
                View Details
              </Text>
            </Container>
          </Root>
        </group>
      )}
    </group>
  )
}

function DetailOverlay({
  data,
  scrollData,
  onBack,
  theme,
}: {
  data: (typeof PRODUCTS)[0]
  scrollData: { current: number }
  onBack: () => void
  theme: ProductTheme
}) {
  const { width, height } = useThree((state) => state.viewport)
  const group = useRef<THREE.Group>(null)
  const setCustomBackAction = useAppStore((state) => state.setCustomBackAction)

  // Register custom back action
  // We wrap the setter in a stable useEffect to avoid constant resets
  useEffect(() => {
    setCustomBackAction(onBack)
    return () => setCustomBackAction(null)
  }, [onBack, setCustomBackAction])

  const isMobile = width < 10 // Approximation
  const mobileMaxWidth = 430

  return (
    <group ref={group} position={[width > 10 ? width * 0.25 : 0, 0, 0]}>
      <DetailSection index={0} scrollData={scrollData} title='Description' theme={theme}>
        <Text
          color={theme.textPrimary}
          fontSize={width > 10 ? 96 : 48}
          maxWidth={width > 10 ? 630 : mobileMaxWidth}
          lineHeight={1.5}
        >
          {data.description}
        </Text>
      </DetailSection>

      <DetailSection index={1} scrollData={scrollData} title='Options' theme={theme}>
        <Container flexDirection='row' gap={10} flexWrap='wrap' maxWidth={width > 10 ? 400 : mobileMaxWidth}>
          {['US 7', 'US 8', 'US 9', 'US 10', 'US 11'].map((size) => (
            <Container
              key={size}
              padding={12}
              backgroundColor={theme.chipBg}
              borderRadius={8}
              cursor='pointer'
              borderWidth={1}
              borderColor={theme.chipBorder}
              hover={{ borderColor: theme.textPrimary, backgroundColor: theme.chipHoverBg }}
            >
              <Text color={theme.textPrimary} fontSize={14} fontWeight='bold'>
                {size}
              </Text>
            </Container>
          ))}
        </Container>
      </DetailSection>

      <DetailSection index={2} scrollData={scrollData} title='More Info' theme={theme}>
        <Container flexDirection='column' gap={8}>
          {data.details?.map((detail, i) => (
            <Text key={i} color={theme.mutedText} fontSize={16}>
              • {detail}
            </Text>
          ))}
        </Container>
      </DetailSection>

      <DetailSection index={3} scrollData={scrollData} title='Actions' theme={theme}>
        <Container
          backgroundColor={data.color}
          padding={24}
          borderRadius={48}
          cursor='pointer'
          onClick={() => window.open(data.url, '_blank')}
        >
          <Text color={getReadableTextColor(data.color)} fontWeight='bold' fontSize={20}>
            Buy Now - ${data.price}
          </Text>
        </Container>
      </DetailSection>
    </group>
  )
}

function DetailSection({
  index,
  scrollData,
  title,
  children,
  theme,
}: {
  index: number
  scrollData: { current: number }
  title: string
  children: React.ReactNode
  theme: ProductTheme
}) {
  const group = useRef<THREE.Group>(null)
  const { width, height } = useThree((state) => state.viewport)

  useFrame(() => {
    if (!group.current) return

    const scroll = scrollData.current
    const dist = index - scroll
    const absDist = Math.abs(dist)

    const isMobile = window.innerWidth < 600

    // Spacing factor depends on viewport height to ensure good separation
    // When scroll = index, Y = 0
    const spacing = height * 0.8

    // If mobile, snap "above center".
    // Center is Y=0.
    // Above center is Y > 0.
    // Let's shift the "center" point up by 20% of height.
    const topOffset = isMobile ? height * 0.125 : 0
    const bottomOffset = isMobile ? -height * 0.08 : 0

    // Index 0 snaps to topOffset, others to bottomOffset
    const centerOffset = index === 0 ? topOffset : bottomOffset

    const targetY = dist * -spacing + centerOffset

    // Horizontal Animation (Right to Left as it enters)
    // Move it to the right as it gets further from center
    // Factor 3 ensures visible movement
    const targetX = absDist * 20 - 8

    // Zoom Animation
    // Scale 1.0 at center, 0.5 at edges (distance = 1)
    // Clamp scaling to avoid it disappearing completely or growing too large
    const targetScale = 4 - Math.min(absDist, 1) * 0.4

    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.1)
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.1)
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.1))

    // Visibility optimization
    group.current.visible = absDist < 2.5
  })

  const isMobile = width < 10
  const baseX = isMobile ? -width * 0.35 : -10

  return (
    <group ref={group} position={[baseX, -index * 5, 0]}>
      <Root pixelSize={0.01} flexDirection='column' alignItems='flex-start'>
        <Text fontSize={32} color={theme.textPrimary} fontWeight='bold' marginBottom={24}>
          {title}
        </Text>
        {children}
      </Root>
    </group>
  )
}

function ProductScene({
  selectedId,
  onSelectProduct,
  mode,
}: {
  selectedId: number | null
  onSelectProduct: (id: number | null) => void
  mode: 'light' | 'dark'
}) {
  const scroll = useScroll()
  const scrollData = useRef({ current: 0 })
  const listSnap = useRef(0)
  const theme = PRODUCT_THEMES[mode]

  useFrame((_, delta) => {
    const totalPages = selectedId !== null ? DETAIL_PAGES : LIST_PAGES
    const raw = scroll.offset * (totalPages - 1)

    if (selectedId !== null) {
      const snapped = sineSnap(raw)
      scrollData.current.current = snapped
    } else {
      const stickyTarget = magneticSnap(raw, LIST_PAGES - 1, 0.9)
      listSnap.current = THREE.MathUtils.damp(listSnap.current, stickyTarget, 18, delta)
      scrollData.current.current = listSnap.current
    }
  })

  const selectedProduct = PRODUCTS.find((p) => p.id === selectedId)

  // Stabilize the onBack callback
  const handleBack = useCallback(() => {
    console.log('handleBack')
    onSelectProduct(null)
  }, [onSelectProduct])

  return (
    <>
      <ScrollHandler selectedId={selectedId} />

      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Suspense fallback={null}>
        {PRODUCTS.map((product, index) => (
          <ProductItem
            key={product.id}
            index={index}
            data={product}
            scrollData={scrollData.current}
            selectedId={selectedId}
            onSelect={(id) => onSelectProduct(id)}
            theme={theme}
          />
        ))}
      </Suspense>
      {selectedId !== null && selectedProduct && (
        <DetailOverlay data={selectedProduct} scrollData={scrollData.current} onBack={handleBack} theme={theme} />
      )}
    </>
  )
}

type ProductsSandboxProps = {
  detailSlug?: string
  parentSlug?: string
}

export default function ProductsSandbox({ detailSlug, parentSlug = 'products' }: ProductsSandboxProps) {
  const router = useRouter()
  const mode = useAppStore((state) => state.mode)
  const routeSelectedId = detailSlug ? (PRODUCT_BY_SLUG.get(detailSlug)?.id ?? null) : null
  const [selectedId, setSelectedId] = useState<number | null>(() => routeSelectedId)
  const basePath = `/space/${parentSlug}`

  useEffect(() => {
    setSelectedId(routeSelectedId)
  }, [routeSelectedId])

  const handleSelectProduct = useCallback(
    (id: number | null) => {
      if (id === null) {
        setSelectedId(null)
        router.replace(basePath, { scroll: false })
        return
      }

      if (routeSelectedId === id) {
        return
      }

      const product = PRODUCTS.find((p) => p.id === id)
      if (!product) return

      setSelectedId(id)

      const targetUrl = `${basePath}/${product.slug}`
      if (routeSelectedId === null) {
        router.push(targetUrl, { scroll: false })
      } else {
        router.replace(targetUrl, { scroll: false })
      }
    },
    [basePath, routeSelectedId, router],
  )

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={15} />

      <Suspense fallback={null}>
        <ScrollControls
          pages={selectedId !== null ? DETAIL_PAGES : LIST_PAGES}
          damping={0.2}
          style={{ pointerEvents: 'auto' }}
        >
          <ProductScene selectedId={selectedId} onSelectProduct={handleSelectProduct} mode={mode} />
        </ScrollControls>
      </Suspense>
    </>
  )
}
