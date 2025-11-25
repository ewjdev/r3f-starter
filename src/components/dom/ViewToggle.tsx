'use client'

import { useSpring, animated } from '@react-spring/web'
import { useAppStore } from '@/store'
import { cn } from '@/utils'

export default function ViewToggle() {
  const viewMode = useAppStore((state) => state.viewMode)
  const setViewMode = useAppStore((state) => state.setViewMode)
  const mode = useAppStore((state) => state.mode)
  const isDark = mode === 'dark'

  const is3D = viewMode === '3d'

  // All hooks must be called before any conditional returns
  const spring = useSpring({
    x: is3D ? 0 : 28,
    config: { tension: 300, friction: 25 },
  })

  const handleToggle = () => {
    setViewMode(is3D ? '2d' : '3d')
  }

  // Don't show toggle if user hasn't made initial selection
  if (viewMode === null) return null

  return (
    <div className='fixed top-4 right-4 z-[10002] flex items-center gap-3'>
      <span
        className={cn(
          'text-sm font-medium transition-opacity',
          isDark ? 'text-slate-400' : 'text-slate-500',
          is3D ? 'opacity-50' : 'opacity-100'
        )}
      >
        2D
      </span>

      <button
        onClick={handleToggle}
        className={cn(
          'relative w-14 h-8 rounded-full transition-colors duration-300',
          isDark
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
          style={{ x: spring.x }}
          className={cn(
            'absolute top-1 left-1 w-6 h-6 rounded-full shadow-md',
            'flex items-center justify-center text-xs font-bold',
            isDark ? 'bg-white text-slate-900' : 'bg-white text-slate-700'
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
          isDark ? 'text-slate-400' : 'text-slate-500',
          is3D ? 'opacity-100' : 'opacity-50'
        )}
      >
        3D
      </span>
    </div>
  )
}

