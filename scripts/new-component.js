#!/usr/bin/env node

/**
 * Component Generator Script
 * Creates a new canvas or DOM component with boilerplate code.
 *
 * Usage: pnpm new:component
 */

import { createInterface } from 'readline'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, '..')

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (prompt) =>
  new Promise((resolve) => {
    rl.question(prompt, resolve)
  })

function toPascalCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toUpperCase())
}

function generateCanvasComponent(name) {
  return `'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

interface ${name}Props {
  position?: [number, number, number]
  scale?: number
}

export default function ${name}({ position = [0, 0, 0], scale = 1 }: ${name}Props) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    // Animation logic here
    // Example: groupRef.current?.rotation.y += delta * 0.5
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Add your 3D content here */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  )
}
`
}

function generateDOMComponent(name) {
  return `'use client'

import { cn } from '@/utils'

interface ${name}Props {
  children?: React.ReactNode
  className?: string
}

export default function ${name}({ children, className }: ${name}Props) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  )
}
`
}

function generateHook(name) {
  return `import { useState, useEffect } from 'react'

/**
 * ${name}
 * 
 * Description of what this hook does.
 */
export function ${name}() {
  const [value, setValue] = useState<unknown>(null)

  useEffect(() => {
    // Effect logic here
  }, [])

  return value
}
`
}

async function main() {
  console.log('\n🧩 Component Generator\n')
  console.log('Create a new component for your project.\n')

  // Get component type
  console.log('Component types:')
  console.log('  1. Canvas (3D component for Three.js)')
  console.log('  2. DOM (2D React component)')
  console.log('  3. Hook (Custom React hook)')
  console.log('')

  const typeInput = await question('Select type (1/2/3): ')
  const type = typeInput.trim()

  if (!['1', '2', '3'].includes(type)) {
    console.error('❌ Invalid type. Please enter 1, 2, or 3.')
    process.exit(1)
  }

  // Get component name
  const namePrompt =
    type === '3' ? 'Hook name (e.g., "useMyHook"): ' : 'Component name (e.g., "MyComponent"): '
  const name = await question(namePrompt)

  if (!name.trim()) {
    console.error('❌ Name is required')
    process.exit(1)
  }

  let componentName = toPascalCase(name)
  let template
  let targetDir
  let fileName

  switch (type) {
    case '1': // Canvas
      targetDir = join(ROOT, 'src/components/canvas')
      fileName = `${componentName}.tsx`
      template = generateCanvasComponent(componentName)
      break

    case '2': // DOM
      targetDir = join(ROOT, 'src/components/dom')
      fileName = `${componentName}.tsx`
      template = generateDOMComponent(componentName)
      break

    case '3': // Hook
      // Ensure hook name starts with 'use'
      if (!componentName.toLowerCase().startsWith('use')) {
        componentName = 'use' + componentName
      }
      // hooks are camelCase
      componentName = componentName.charAt(0).toLowerCase() + componentName.slice(1)
      targetDir = join(ROOT, 'src/hooks')
      fileName = `${componentName}.ts`
      template = generateHook(componentName)
      break
  }

  // Ensure directory exists
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true })
  }

  const filePath = join(targetDir, fileName)

  // Check if file exists
  if (existsSync(filePath)) {
    console.error(`❌ File already exists: ${filePath}`)
    process.exit(1)
  }

  // Write the file
  writeFileSync(filePath, template, 'utf-8')

  const relativePath = filePath.replace(ROOT + '/', '')
  console.log(`\n✅ Created: ${relativePath}`)

  // Type-specific instructions
  console.log('\n💡 Next steps:')

  switch (type) {
    case '1':
      console.log(`   1. Edit ${relativePath}`)
      console.log(`   2. Import in your sandbox or page:`)
      console.log(`      import ${componentName} from '@/components/canvas/${componentName}'`)
      console.log(`   3. Use inside <Three> tunnel or within Canvas`)
      break

    case '2':
      console.log(`   1. Edit ${relativePath}`)
      console.log(`   2. Import in your page:`)
      console.log(`      import ${componentName} from '@/components/dom/${componentName}'`)
      break

    case '3':
      console.log(`   1. Edit ${relativePath}`)
      console.log(`   2. Import in your component:`)
      console.log(`      import { ${componentName} } from '@/hooks/${componentName}'`)
      break
  }

  console.log('')
  rl.close()
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})

