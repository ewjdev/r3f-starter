import dynamic from 'next/dynamic'

export type SandboxConfig = {
  slug: string
  title: string
  char: string
  color: string
  position: [number, number, number]
  rotation: [number, number, number]
  description: string
  component: any // Using any for dynamic component for now to avoid strict type issues with dynamic imports in config
}

export const sandboxes: SandboxConfig[] = [
  {
    slug: 'about',
    title: 'About Us',
    char: 'A',
    color: '#ff6b6b',
    position: [-2, 50, -2],
    rotation: [4, 5, 6],
    description: 'Learn more about our story and mission.',
    component: dynamic(() => import('@/sandboxes/business/AboutSandbox')),
  },
  {
    slug: 'services',
    title: 'Services',
    char: 'S',
    color: '#4ecdc4',
    position: [2, 70, 2],
    rotation: [7, 8, 9],
    description: 'Explore the services we offer.',
    component: dynamic(() => import('@/sandboxes/business/ServicesSandbox')),
  },
  {
    slug: 'products',
    title: 'Products',
    char: 'P',
    color: '#ffe66d',
    position: [-3, 90, 2],
    rotation: [4, 2, 6],
    description: 'Browse our latest products.',
    component: dynamic(() => import('@/sandboxes/business/ProductsSandbox')),
  },
  {
    slug: 'contact',
    title: 'Contact',
    char: 'C',
    color: '#1a535c',
    position: [3, 60, -3],
    rotation: [10, 11, 12],
    description: 'Get in touch with us.',
    component: dynamic(() => import('@/sandboxes/business/ContactSandbox')),
  },
]

