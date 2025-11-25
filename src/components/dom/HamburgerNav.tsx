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
  const viewMode = useAppStore((state) => state.viewMode)
  const setViewMode = useAppStore((state) => state.setViewMode)
  const router = useRouter()
  const mode = useAppStore((state) => state.mode)
  const isDarkMode = mode === 'dark'

  const { x } = useSpring({
    x: isNavOpen ? 0 : 100,
    config: { tension: 280, friction: 30 },
  })

  const toggleSpring = useSpring({
    x: viewMode === '3d' ? 0 : 28,
    config: { tension: 300, friction: 25 },
  })

  const handleNavigate = (slug: string) => {
    setNavOpen(false)
    // Only use 3D transition if in 3D mode
    if (viewMode === '3d') {
      startTransition(slug)
      setTimeout(() => {
        router.push(`/space/${slug}`)
      }, 300)
    } else {
      router.push(`/space/${slug}`)
    }
  }

  const is3D = viewMode === '3d'

  return (
    <>
      <button
        className={cn(
          'fixed top-8 right-8 z-[10002] w-12 h-12 flex flex-col justify-center items-center gap-1.5 rounded-full cursor-pointer transition-colors border backdrop-blur-md',
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
          'fixed z-[10001] top-0 right-0 h-screen w-full md:w-96 backdrop-blur-xl flex flex-col justify-center items-center gap-8 shadow-2xl border-l',
          isDarkMode ? 'bg-black/90 text-white border-white/10' : 'bg-white/90 text-black border-black/10',
          !isNavOpen && 'pointer-events-none'
        )}
        style={{ transform: x.to((x) => `translateX(${x}%)`) }}
      >
        {/* Navigation Links */}
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

        {/* Divider */}
        <div className={cn('w-32 h-px my-4', isDarkMode ? 'bg-white/20' : 'bg-black/10')} />

        {/* View Mode Toggle - only show if user has made initial selection */}
        {viewMode !== null && (
          <div className='flex flex-col items-center gap-3'>
            <span className={cn('text-sm uppercase tracking-widest', isDarkMode ? 'text-white/50' : 'text-black/50')}>
              View Mode
            </span>
            <div className='flex items-center gap-3'>
              <span
                className={cn(
                  'text-sm font-medium transition-opacity',
                  isDarkMode ? 'text-slate-400' : 'text-slate-500',
                  is3D ? 'opacity-50' : 'opacity-100'
                )}
              >
                2D
              </span>

              <button
                onClick={() => setViewMode(is3D ? '2d' : '3d')}
                className={cn(
                  'relative w-14 h-8 rounded-full transition-colors duration-300',
                  isDarkMode
                    ? is3D
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                      : 'bg-slate-700'
                    : is3D
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                      : 'bg-slate-300'
                )}
                aria-label={`Switch to ${is3D ? '2D' : '3D'} mode`}
              >
                <animated.div
                  style={{ x: toggleSpring.x }}
                  className={cn(
                    'absolute top-1 left-1 w-6 h-6 rounded-full shadow-md',
                    'flex items-center justify-center text-xs font-bold',
                    isDarkMode ? 'bg-white text-slate-900' : 'bg-white text-slate-700'
                  )}
                >
                  {is3D ? (
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5'
                      />
                    </svg>
                  ) : (
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
                      />
                    </svg>
                  )}
                </animated.div>
              </button>

              <span
                className={cn(
                  'text-sm font-medium transition-opacity',
                  isDarkMode ? 'text-slate-400' : 'text-slate-500',
                  is3D ? 'opacity-100' : 'opacity-50'
                )}
              >
                3D
              </span>
            </div>
          </div>
        )}
      </animated.div>
    </>
  )
}
