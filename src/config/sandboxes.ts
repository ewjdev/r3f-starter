import dynamic from 'next/dynamic'

export type SandboxConfig = {
  slug: string
  title: string
  char: string
  color: string
  position: [number, number, number]
  rotation: [number, number, number]
  description: string
  component: ReturnType<typeof dynamic>
  // 2D-specific content (optional)
  textBody?: string
  images?: string[]
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
    component: dynamic(() => import('@/sandboxes/Basic')),
    textBody: 'Founded with a vision to transform the industry, we have grown from a small team to a global organization.',
  },
  {
    slug: 'services',
    title: 'Services',
    char: 'S',
    color: '#4ecdc4',
    position: [2, 70, 2],
    rotation: [7, 8, 9],
    description: 'Explore the services we offer.',
    component: dynamic(() => import('@/sandboxes/Shoe')),
    textBody: 'We offer a wide range of professional services tailored to your needs.',
  },
  {
    slug: 'products',
    title: 'Products',
    char: 'P',
    color: '#ffe66d',
    position: [-3, 90, 2],
    rotation: [4, 2, 6],
    description: 'Browse our latest products.',
    component: dynamic(() => import('@/sandboxes/Turtle')),
    textBody: 'Discover our innovative product lineup designed for modern businesses.',
  },
  {
    slug: 'contact',
    title: 'Contact',
    char: 'C',
    color: '#1a535c',
    position: [3, 60, -3],
    rotation: [10, 11, 12],
    description: 'Get in touch with us.',
    component: dynamic(() => import('@/sandboxes/PingPong')),
    textBody: 'We would love to hear from you. Reach out to us anytime.',
  },
]

