'use client'

import { useRef } from 'react'
import { useAppStore } from '@/store'
import { Html, Sparkles, Center, Text, OrthographicCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export default function ContactSandbox({ onHomePage }: { onHomePage?: boolean }) {
  const mode = useAppStore((state) => state.mode)
  const textColor = mode === 'dark' ? '#ffffff' : '#1a535c'
  const sparklesRef = useRef(null)

  useFrame((state) => {
    if (sparklesRef.current) {
      // Get normalized mouse coordinates (-1 to 1)
      const { x, y } = state.mouse

      const nextX = x - sparklesRef.current.position.x
      const nextY = y - sparklesRef.current.position.y
      // Smoothly interpolate sparkles position based on mouse
      // Scale the movement to make it subtle (multiplied by 3 for orthographic camera)
      sparklesRef.current.position.x += nextX * 0.001
      sparklesRef.current.position.y += nextY * 0.05
    }
  })

  return (
    <group>
      <OrthographicCamera makeDefault position={[0, 0, 2]} zoom={20} />
      <Sparkles ref={sparklesRef} count={100} scale={30} size={3} speed={0.2} opacity={0.6} color='#1a535c' />

      <Center position={[0, 10, 0]}>
        <Text fontSize={1} color={textColor}>
          Get in Touch
        </Text>
      </Center>

      <Html
        zIndexRange={[800, 900]}
        transform
        position={[0, -0.5, 0]}
        distanceFactor={20}
        style={{ display: onHomePage ? 'none' : 'block' }}
      >
        <div className='bg-white/90 p-6 rounded-xl shadow-2xl w-[350px] text-center backdrop-blur-sm'>
          <p className='mb-4 text-gray-600 text-sm'>Ready to start your project? Send us a message.</p>
          <form className='flex flex-col gap-3' onSubmit={(e) => e.preventDefault()}>
            <input
              type='email'
              placeholder='Your Email'
              className='p-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a535c]'
            />
            <textarea
              placeholder='Tell us about your idea...'
              className='p-2 border border-gray-300 rounded text-gray-800 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#1a535c]'
            />
            <button className='bg-[#1a535c] text-white py-2 rounded hover:bg-[#134048] transition font-medium'>
              Send Message
            </button>
          </form>
        </div>
      </Html>
    </group>
  )
}
