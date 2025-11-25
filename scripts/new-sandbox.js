#!/usr/bin/env node

/**
 * Sandbox Generator Script
 * Creates a new sandbox with boilerplate code and registers it in the config.
 *
 * Usage: pnpm new:sandbox
 */

import { createInterface } from 'readline'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
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

const COLORS = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#1a535c', '#6fffe9', '#f77f00', '#9b5de5', '#00f5d4']

function toPascalCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toUpperCase())
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

function generateSandboxTemplate(name, description) {
  const componentName = toPascalCase(name) + 'Sandbox'

  return `'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

interface ${componentName}Props {
  onHomePage?: boolean
}

export default function ${componentName}({ onHomePage }: ${componentName}Props) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <>
      {/* Background color */}
      <color attach="background" args={['#0a0a0a']} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#4ecdc4" />

      {/* Main content */}
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#ff6b6b" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Ground plane (optional) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </>
  )
}
`
}

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

function getRandomPosition() {
  const x = (Math.random() - 0.5) * 6
  const y = 50 + Math.random() * 50
  const z = (Math.random() - 0.5) * 6
  return [Math.round(x * 10) / 10, Math.round(y), Math.round(z * 10) / 10]
}

function getRandomRotation() {
  return [
    Math.round(Math.random() * 12),
    Math.round(Math.random() * 12),
    Math.round(Math.random() * 12),
  ]
}

async function updateSandboxConfig(slug, title, char, color, position, rotation, description, subdir) {
  const configPath = join(ROOT, 'src/config/sandboxes.ts')
  let content = readFileSync(configPath, 'utf-8')

  const importPath = subdir ? `@/sandboxes/${subdir}/${toPascalCase(slug)}Sandbox` : `@/sandboxes/${toPascalCase(slug)}Sandbox`

  const newEntry = `  {
    slug: '${slug}',
    title: '${title}',
    char: '${char}',
    color: '${color}',
    position: [${position.join(', ')}],
    rotation: [${rotation.join(', ')}],
    description: '${description}',
    Component: dynamic(() => import('${importPath}')),
  },`

  // Find the closing bracket of the sandboxes array and insert before it
  const arrayEndRegex = /(\]\s*$)/
  content = content.replace(arrayEndRegex, `${newEntry}\n]`)

  writeFileSync(configPath, content, 'utf-8')
}

async function main() {
  console.log('\n🎨 Sandbox Generator\n')
  console.log('This will create a new sandbox scene with boilerplate code.\n')

  // Get sandbox name
  const name = await question('Sandbox name (e.g., "my-scene" or "MyScene"): ')
  if (!name.trim()) {
    console.error('❌ Name is required')
    process.exit(1)
  }

  const slug = toKebabCase(name)
  const pascalName = toPascalCase(name)

  // Get title
  const titleDefault = pascalName.replace(/([A-Z])/g, ' $1').trim()
  const titleInput = await question(`Display title [${titleDefault}]: `)
  const title = titleInput.trim() || titleDefault

  // Get description
  const description = await question('Short description: ')

  // Get subdirectory (optional)
  const subdirInput = await question('Subdirectory (leave empty for root sandboxes folder): ')
  const subdir = subdirInput.trim() || ''

  // Get character for 3D letter
  const charDefault = title.charAt(0).toUpperCase()
  const charInput = await question(`Letter character for 3D display [${charDefault}]: `)
  const char = (charInput.trim() || charDefault).charAt(0).toUpperCase()

  // Generate random values
  const color = getRandomColor()
  const position = getRandomPosition()
  const rotation = getRandomRotation()

  // Determine file path
  let sandboxDir = join(ROOT, 'src/sandboxes')
  if (subdir) {
    sandboxDir = join(sandboxDir, subdir)
    if (!existsSync(sandboxDir)) {
      mkdirSync(sandboxDir, { recursive: true })
      console.log(`📁 Created directory: src/sandboxes/${subdir}`)
    }
  }

  const fileName = `${pascalName}Sandbox.tsx`
  const filePath = join(sandboxDir, fileName)

  // Check if file exists
  if (existsSync(filePath)) {
    console.error(`❌ File already exists: ${filePath}`)
    process.exit(1)
  }

  // Generate and write the sandbox file
  const template = generateSandboxTemplate(name, description)
  writeFileSync(filePath, template, 'utf-8')
  console.log(`✅ Created: src/sandboxes/${subdir ? subdir + '/' : ''}${fileName}`)

  // Update config
  await updateSandboxConfig(slug, title, char, color, position, rotation, description || 'A new sandbox scene.', subdir)
  console.log('✅ Updated: src/config/sandboxes.ts')

  console.log(`\n🎉 Sandbox created successfully!`)
  console.log(`\n📍 Access your sandbox at: /space/${slug}`)
  console.log(`\n💡 Next steps:`)
  console.log(`   1. Edit src/sandboxes/${subdir ? subdir + '/' : ''}${fileName}`)
  console.log(`   2. Add your 3D scene content`)
  console.log(`   3. Optionally adjust config in src/config/sandboxes.ts\n`)

  rl.close()
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})

