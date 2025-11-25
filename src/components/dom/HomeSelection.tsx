'use client'

import { useSpring, animated } from '@react-spring/web'
import { useAppStore } from '@/store'
import { cn } from '@/utils'

export default function HomeSelection() {
  const setViewMode = useAppStore((state) => state.setViewMode)
  const mode = useAppStore((state) => state.mode)
  const isDark = mode === 'dark'

  const fadeIn = useSpring({
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0 },
    delay: 300,
    config: { tension: 200, friction: 20 },
  })

  const buttonSpring1 = useSpring({
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    delay: 600,
    config: { tension: 200, friction: 20 },
  })

  const buttonSpring2 = useSpring({
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    delay: 750,
    config: { tension: 200, friction: 20 },
  })

  return (
    <div
      className={cn(
        'fixed inset-0 z-[10000] flex flex-col items-center justify-center',
        'bg-gradient-to-br',
        isDark ? 'from-slate-950 via-slate-900 to-slate-950' : 'from-slate-50 via-white to-slate-100',
      )}
    >
      {/* Decorative background elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div
          className={cn(
            'absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20',
            isDark ? 'bg-cyan-500' : 'bg-cyan-300',
          )}
        />
        <div
          className={cn(
            'absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20',
            isDark ? 'bg-gray-500' : 'bg-gray-300',
          )}
        />
      </div>

      <animated.div style={fadeIn} className='relative z-10 text-center px-6 max-w-2xl'>
        <h1
          className={cn('text-5xl md:text-7xl font-bold mb-6 tracking-tight', isDark ? 'text-white' : 'text-slate-900')}
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          Welcome
        </h1>
        <p className={cn('text-lg md:text-xl mb-12 leading-relaxed', isDark ? 'text-slate-300' : 'text-slate-600')}>
          Choose your experience. You can switch between modes at any time.
        </p>

        <div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
          <animated.button
            style={buttonSpring1}
            onClick={() => setViewMode('3d')}
            className={cn(
              'group relative px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-300',
              'overflow-hidden',
              isDark
                ? 'bg-gradient-to-r from-gray-600 to-gray-100 text-white hover:shadow-2xl hover:shadow-cyan-500/30'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-2xl hover:shadow-blue-500/40',
            )}
          >
            <span className='relative z-10 flex items-center gap-3'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5'
                />
              </svg>
              Immersive 3D
            </span>
            <div className='absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300' />
          </animated.button>

          <animated.button
            style={buttonSpring2}
            onClick={() => setViewMode('2d')}
            className={cn(
              'group relative px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-300',
              'border-2',
              isDark
                ? 'border-slate-600 text-white hover:border-slate-400 hover:bg-slate-800/50'
                : 'border-slate-300 text-slate-800 hover:border-cyan-500 hover:bg-cyan-100',
            )}
          >
            <span className='relative z-10 flex items-center gap-3'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
                />
              </svg>
              Traditional
            </span>
          </animated.button>
        </div>

        <p className={cn('mt-8 text-sm', isDark ? 'text-slate-500' : 'text-slate-400')}>
          Tip: Hold the top-left corner to toggle light/dark mode
        </p>
      </animated.div>
    </div>
  )
}
