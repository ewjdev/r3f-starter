import { sandboxes, SandboxConfig } from '@/config/sandboxes'

export async function fetchSandbox(slug: string): Promise<SandboxConfig | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  const sandbox = sandboxes.find((s) => s.slug === slug)
  return sandbox || null
}

export async function fetchAllSandboxes(): Promise<SandboxConfig[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return sandboxes
}

