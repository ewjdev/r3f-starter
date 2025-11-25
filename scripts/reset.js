#!/usr/bin/env node

/**
 * Reset Script
 * Removes example sandboxes and resets the project to a clean starter state.
 *
 * Usage: pnpm reset
 */

import { createInterface } from 'readline'
import { rmSync, writeFileSync, readFileSync, existsSync } from 'fs'
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

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Files and directories to remove
const ITEMS_TO_REMOVE = [
  // Example sandboxes
  'src/sandboxes/business',
  'src/sandboxes/Basic.tsx',
  'src/sandboxes/PingPong.tsx',
  'src/sandboxes/Rocket.tsx',
  'src/sandboxes/Shoe.tsx',
  'src/sandboxes/Stencil.tsx',
  'src/sandboxes/Turtle.tsx',
  // Example models (keep react-transformed as a demo)
  'public/models/shoe-draco.glb',
  'public/models/turtle.glb',
  'public/dog.glb',
  'public/duck.glb',
]

// Clean sandbox config template
const CLEAN_SANDBOX_CONFIG = `import dynamic from 'next/dynamic'

export type SandboxConfig = {
  slug: string
  title: string
  char: string
  color: string
  position: [number, number, number]
  rotation: [number, number, number]
  description: string
  Component: any
}

// Add your sandboxes here
// Example:
// {
//   slug: 'my-sandbox',
//   title: 'My Sandbox',
//   char: 'M',
//   color: '#ff6b6b',
//   position: [0, 50, 0],
//   rotation: [0, 0, 0],
//   description: 'My custom 3D scene.',
//   Component: dynamic(() => import('@/sandboxes/MySandbox')),
// },

export const sandboxes: SandboxConfig[] = []
`

// Clean store template (remove view mode preference on reset)
const CLEAN_STORE_ADDITION = `// Store has been reset - viewMode will default to null (selection screen)`

async function main() {
  console.log(`
${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
  ${colors.yellow}⚠ Project Reset${colors.reset}
${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

This will remove example sandboxes and reset the project
to a clean starter state.

${colors.dim}The following will be removed:${colors.reset}
`)

  ITEMS_TO_REMOVE.forEach((item) => {
    const fullPath = join(ROOT, item)
    const exists = existsSync(fullPath)
    const status = exists ? colors.red + '✗' : colors.dim + '○'
    const itemColor = exists ? 'reset' : 'dim'
    console.log(`  ${status}${colors.reset} ${colors[itemColor]}${item}${colors.reset}`)
  })

  console.log(`
${colors.dim}The sandbox config will be reset to an empty array.${colors.reset}
`)

  const confirm = await question('Are you sure you want to continue? (y/N): ')

  if (confirm.toLowerCase() !== 'y') {
    log('\nReset cancelled.', 'yellow')
    rl.close()
    process.exit(0)
  }

  console.log('')

  // Remove files and directories
  let removedCount = 0
  ITEMS_TO_REMOVE.forEach((item) => {
    const fullPath = join(ROOT, item)
    if (existsSync(fullPath)) {
      try {
        rmSync(fullPath, { recursive: true, force: true })
        log(`  ${colors.green}✓${colors.reset} Removed: ${item}`)
        removedCount++
      } catch (err) {
        log(`  ${colors.red}✗${colors.reset} Failed to remove: ${item}`, 'red')
      }
    }
  })

  // Reset sandbox config
  const configPath = join(ROOT, 'src/config/sandboxes.ts')
  try {
    writeFileSync(configPath, CLEAN_SANDBOX_CONFIG, 'utf-8')
    log(`  ${colors.green}✓${colors.reset} Reset: src/config/sandboxes.ts`)
  } catch (err) {
    log(`  ${colors.red}✗${colors.reset} Failed to reset sandbox config`, 'red')
  }

  console.log(`
${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

  ${colors.green}✓${colors.reset} Reset complete! Removed ${removedCount} items.

  ${colors.dim}Next steps:${colors.reset}
    1. Create your first sandbox: ${colors.cyan}pnpm new:sandbox${colors.reset}
    2. Start development: ${colors.cyan}pnpm dev${colors.reset}

${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
`)

  rl.close()
}

main().catch((err) => {
  console.error('Reset failed:', err)
  rl.close()
  process.exit(1)
})

