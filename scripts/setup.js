#!/usr/bin/env node

/**
 * Project Setup Script
 * Initializes the project after cloning.
 *
 * Usage: pnpm setup
 */

import { execSync, spawn } from 'child_process'
import { existsSync, writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, '..')

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

function logStep(step, message) {
  console.log(`\n${colors.cyan}[${step}]${colors.reset} ${message}`)
}

function logSuccess(message) {
  console.log(`${colors.green}✓${colors.reset} ${message}`)
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠${colors.reset} ${message}`)
}

function logError(message) {
  console.log(`${colors.red}✗${colors.reset} ${message}`)
}

function checkNodeVersion() {
  logStep('1/4', 'Checking Node.js version...')

  const nodeVersion = process.version
  const major = parseInt(nodeVersion.slice(1).split('.')[0], 10)

  if (major >= 22) {
    logSuccess(`Node.js ${nodeVersion} detected`)
    return true
  } else {
    logError(`Node.js ${nodeVersion} detected. This project requires Node.js >= 22.x`)
    log('   Please upgrade Node.js: https://nodejs.org/', 'dim')
    return false
  }
}

function detectPackageManager() {
  // Check for lockfiles
  if (existsSync(join(ROOT, 'pnpm-lock.yaml'))) {
    return 'pnpm'
  } else if (existsSync(join(ROOT, 'yarn.lock'))) {
    return 'yarn'
  } else if (existsSync(join(ROOT, 'package-lock.json'))) {
    return 'npm'
  }

  // Default to pnpm
  return 'pnpm'
}

function installDependencies() {
  logStep('2/4', 'Installing dependencies...')

  const pm = detectPackageManager()
  log(`   Using ${pm}`, 'dim')

  try {
    execSync(`${pm} install`, {
      cwd: ROOT,
      stdio: 'inherit',
    })
    logSuccess('Dependencies installed')
    return true
  } catch (error) {
    logError('Failed to install dependencies')
    return false
  }
}

function createEnvFile() {
  logStep('3/4', 'Setting up environment...')

  const envPath = join(ROOT, '.env.local')
  const envExamplePath = join(ROOT, '.env.example')

  if (existsSync(envPath)) {
    logSuccess('.env.local already exists')
    return true
  }

  if (existsSync(envExamplePath)) {
    const content = readFileSync(envExamplePath, 'utf-8')
    writeFileSync(envPath, content, 'utf-8')
    logSuccess('Created .env.local from .env.example')
  } else {
    // Create a minimal .env.local
    const defaultEnv = `# Environment Variables
# Add your environment variables here

# Example:
# NEXT_PUBLIC_API_URL=https://api.example.com
`
    writeFileSync(envPath, defaultEnv, 'utf-8')
    logSuccess('Created .env.local with defaults')
  }

  return true
}

function printNextSteps() {
  logStep('4/4', 'Setup complete!')

  console.log(`
${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

  ${colors.cyan}r3f-next-starter${colors.reset} is ready to go!

  ${colors.dim}Start development server:${colors.reset}
    pnpm dev

  ${colors.dim}Create a new sandbox:${colors.reset}
    pnpm new:sandbox

  ${colors.dim}Create a new component:${colors.reset}
    pnpm new:component

  ${colors.dim}Build for production:${colors.reset}
    pnpm build

${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
`)
}

async function main() {
  console.log(`
${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
  ${colors.cyan}r3f-next-starter${colors.reset} Setup
${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
`)

  // Step 1: Check Node version
  const nodeOk = checkNodeVersion()
  if (!nodeOk) {
    process.exit(1)
  }

  // Step 2: Install dependencies
  const depsOk = installDependencies()
  if (!depsOk) {
    process.exit(1)
  }

  // Step 3: Create .env.local
  createEnvFile()

  // Step 4: Print next steps
  printNextSteps()
}

main().catch((err) => {
  console.error('Setup failed:', err)
  process.exit(1)
})

