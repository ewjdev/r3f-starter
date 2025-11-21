'use client'

import { useSpring, animated } from '@react-spring/web'
import { useAppStore } from '@/store'
import { sandboxes } from '@/config/sandboxes'
import { useRouter } from 'next/navigation'
import { cn } from '@/utils'

export default function HamburgerNav() {
  const isNavOpen = useAppStore((state) => state.isNavOpen)
  const setNavOpen = useAppStore((state) => state.setNavOpen)
  const startTransition = useAppStore((state) => state.startTransition)
  const router = useRouter()
  const mode = useAppStore((state) => state.mode)
  const isDarkMode = mode === 'dark'

  const { x } = useSpring({
    x: isNavOpen ? 0 : 100,
    config: { tension: 280, friction: 60 },
  })

  const handleNavigate = (slug: string) => {
    setNavOpen(false)
    startTransition(slug)
    // Delay navigation slightly to allow transition to start
    setTimeout(() => {
      router.push(`/space/${slug}`)
    }, 300)
  }

  return (
    <>
      <button
        className={cn(
          'fixed top-8 right-8 z-1001 w-12 h-12 flex flex-col justify-center items-center gap-1.5 rounded-full cursor-pointer transition-colors border backdrop-blur-md',
          isDarkMode ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-black/5 border-black/10 hover:bg-black/10',
          isNavOpen && (isDarkMode ? 'bg-white/20' : 'bg-black/10'),
        )}
        onClick={() => setNavOpen(!isNavOpen)}
      >
        <div
          className={cn(
            'w-6 h-0.5 transition-transform',
            isDarkMode ? 'bg-white' : 'bg-black',
            isNavOpen && 'rotate-45 translate-y-2',
          )}
        />
        <div
          className={cn('w-6 h-0.5 transition-opacity', isDarkMode ? 'bg-white' : 'bg-black', isNavOpen && 'opacity-0')}
        />
        <div
          className={cn(
            'w-6 h-0.5 transition-transform',
            isDarkMode ? 'bg-white' : 'bg-black',
            isNavOpen && '-rotate-45 -translate-y-2',
          )}
        />
      </button>

      <animated.div
        className={cn(
          'fixed z-1000 top-0 right-0 h-screen w-full md:w-96 backdrop-blur-xl flex flex-col justify-center items-center gap-8 shadow-2xl border-l',
          isDarkMode ? 'bg-black/90 text-white border-white/10' : 'bg-white/90 text-black border-black/10',
        )}
        style={{ transform: x.to((x) => `translateX(${x}%)`) }}
      >
        {sandboxes.map((s) => (
          <button
            key={s.slug}
            onClick={() => handleNavigate(s.slug)}
            className={cn(
              'text-4xl font-bold transition-colors tracking-tight',
              isDarkMode ? 'text-white hover:text-white/70' : 'text-black hover:text-gray-500',
            )}
          >
            {s.title}
          </button>
        ))}
      </animated.div>
    </>
  )
}
