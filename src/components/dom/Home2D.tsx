'use client'

import { useSpring, animated } from '@react-spring/web'
import { useAppStore } from '@/store'
import { cn } from '@/utils'
import Link from 'next/link'
import { sandboxes } from '@/config/sandboxes'

export default function Home2D() {
  const mode = useAppStore((state) => state.mode)
  const isDark = mode === 'dark'

  const heroSpring = useSpring({
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0 },
    delay: 100,
    config: { tension: 200, friction: 25 },
  })

  return (
    <div
      className={cn(
        'min-h-screen',
        isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'
      )}
    >
      {/* Hero Section */}
      <animated.section
        style={heroSpring}
        className='relative overflow-hidden'
      >
        <div
          className={cn(
            'absolute inset-0 opacity-30',
            isDark
              ? 'bg-gradient-to-br from-blue-900/50 via-transparent to-purple-900/50'
              : 'bg-gradient-to-br from-blue-100 via-transparent to-purple-100'
          )}
        />
        <div className='relative max-w-6xl mx-auto px-6 py-32 md:py-48'>
          <h1
            className='text-6xl md:text-8xl font-bold mb-6 tracking-tight font-stack'
          >
            Your Business
            <span
              className={cn(
                'block text-transparent bg-clip-text',
                isDark
                  ? 'bg-gradient-to-r from-blue-400 to-purple-400'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600'
              )}
            >
              Reimagined
            </span>
          </h1>
          <p
            className={cn(
              'text-xl md:text-2xl max-w-2xl leading-relaxed',
              isDark ? 'text-slate-300' : 'text-slate-600'
            )}
          >
            A modern, fast, and beautiful website for your business.
            Built with the latest technologies for the best user experience.
          </p>
          <div className='mt-10 flex flex-wrap gap-4'>
            <Link
              href='/space/contact'
              className={cn(
                'px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300',
                'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
                'hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5'
              )}
            >
              Get Started
            </Link>
            <Link
              href='/space/about'
              className={cn(
                'px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border-2',
                isDark
                  ? 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'
                  : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
              )}
            >
              Learn More
            </Link>
          </div>
        </div>
      </animated.section>

      {/* Navigation Blocks - Mirrors the 3D letter blocks */}
      <section className={cn('py-24', isDark ? 'bg-slate-900/50' : 'bg-slate-50')}>
        <div className='max-w-6xl mx-auto px-6'>
          <h2
            className={cn(
              'text-3xl md:text-4xl font-bold mb-12 text-center',
              isDark ? 'text-white' : 'text-slate-900'
            )}
          >
            Explore
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {sandboxes.map((page, index) => (
              <PageBlock key={page.slug} page={page} index={index} isDark={isDark} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-24'>
        <div className='max-w-6xl mx-auto px-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <FeatureCard
              isDark={isDark}
              icon={
                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
              }
              title='Lightning Fast'
              description='Built with Next.js for optimal performance and SEO.'
            />
            <FeatureCard
              isDark={isDark}
              icon={
                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' />
                </svg>
              }
              title='Responsive'
              description='Looks great on any device, from mobile to desktop.'
            />
            <FeatureCard
              isDark={isDark}
              icon={
                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' />
                </svg>
              }
              title='Customizable'
              description='Easy to customize colors, fonts, and content.'
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={cn(
          'py-12 border-t',
          isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'
        )}
      >
        <div className='max-w-6xl mx-auto px-6 text-center'>
          <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
            © 2024 Your Business. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function PageBlock({
  page,
  index,
  isDark,
}: {
  page: { slug: string; title: string; description: string; color: string; char: string }
  index: number
  isDark: boolean
}) {
  const spring = useSpring({
    from: { opacity: 0, scale: 0.9, y: 20 },
    to: { opacity: 1, scale: 1, y: 0 },
    delay: 200 + index * 100,
    config: { tension: 200, friction: 25 },
  })

  return (
    <animated.div style={spring}>
      <Link
        href={`/space/${page.slug}`}
        className={cn(
          'group block h-full p-8 rounded-3xl transition-all duration-500',
          'border hover:border-transparent',
          isDark
            ? 'bg-white/5 border-white/10 hover:bg-white/10'
            : 'bg-white border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50'
        )}
      >
        <div className='flex flex-col h-full justify-between gap-8'>
          <div className='flex items-start justify-between'>
            <span
              className={cn(
                'text-4xl font-light',
                isDark ? 'text-white/20 group-hover:text-white/40' : 'text-slate-200 group-hover:text-slate-300'
              )}
            >
              0{index + 1}
            </span>
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                isDark ? 'bg-white/10 group-hover:bg-white/20' : 'bg-slate-50 group-hover:bg-blue-50'
              )}
            >
              <svg 
                className={cn('w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5', isDark ? 'text-white' : 'text-slate-900')} 
                fill='none' 
                viewBox='0 0 24 24' 
                stroke='currentColor'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 17L17 7M17 7H7M17 7V17' />
              </svg>
            </div>
          </div>
          
          <div>
            <h3
              className={cn(
                'text-2xl font-medium mb-2 transition-colors',
                isDark ? 'text-white' : 'text-slate-900 group-hover:text-blue-600'
              )}
            >
              {page.title}
            </h3>
            <p
              className={cn(
                'text-sm leading-relaxed',
                isDark ? 'text-slate-400' : 'text-slate-500'
              )}
            >
              {page.description}
            </p>
          </div>
        </div>
      </Link>
    </animated.div>
  )
}

function FeatureCard({
  isDark,
  icon,
  title,
  description,
}: {
  isDark: boolean
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div
      className={cn(
        'p-6 rounded-2xl text-center',
        isDark ? 'bg-slate-800/30' : 'bg-slate-50'
      )}
    >
      <div
        className={cn(
          'w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center',
          isDark ? 'bg-slate-700 text-blue-400' : 'bg-blue-100 text-blue-600'
        )}
      >
        {icon}
      </div>
      <h3
        className={cn(
          'text-xl font-bold mb-2',
          isDark ? 'text-white' : 'text-slate-900'
        )}
      >
        {title}
      </h3>
      <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>{description}</p>
    </div>
  )
}
