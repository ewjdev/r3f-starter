'use client'

import { useSpring, animated } from '@react-spring/web'
import { useAppStore } from '@/store'
import { cn } from '@/utils'
import Link from 'next/link'

interface Generic2DPageProps {
  title: string
  description: string
  slug: string
  color?: string
  children?: React.ReactNode
}

export default function Generic2DPage({
  title,
  description,
  slug,
  color = '#3b82f6',
  children,
}: Generic2DPageProps) {
  const mode = useAppStore((state) => state.mode)
  const isDark = mode === 'dark'

  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: { tension: 200, friction: 25 },
  })

  const contentSpring = useSpring({
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0 },
    delay: 200,
    config: { tension: 200, friction: 25 },
  })

  return (
    <div
      className={cn(
        'min-h-screen',
        isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'
      )}
    >
      {/* Hero Header */}
      <animated.header
        style={headerSpring}
        className='relative overflow-hidden'
      >
        <div
          className='absolute inset-0 opacity-20'
          style={{
            background: `linear-gradient(135deg, ${color}40 0%, transparent 50%, ${color}20 100%)`,
          }}
        />
        <div className='relative max-w-4xl mx-auto px-6 py-20 md:py-32'>
          <Link
            href='/'
            className={cn(
              'inline-flex items-center gap-2 mb-8 font-medium transition-colors',
              isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-500 hover:text-slate-900'
            )}
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
            Back to Home
          </Link>

          <div
            className='w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-white font-bold text-2xl'
            style={{ backgroundColor: color }}
          >
            {title[0]}
          </div>

          <h1
            className='text-5xl md:text-7xl font-bold mb-6 tracking-tight'
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {title}
          </h1>
          <p
            className={cn(
              'text-xl md:text-2xl max-w-2xl leading-relaxed',
              isDark ? 'text-slate-300' : 'text-slate-600'
            )}
          >
            {description}
          </p>
        </div>
      </animated.header>

      {/* Main Content */}
      <animated.main style={contentSpring} className='max-w-4xl mx-auto px-6 py-16'>
        {children || <DefaultContent slug={slug} isDark={isDark} color={color} />}
      </animated.main>

      {/* Footer Navigation */}
      <footer
        className={cn(
          'py-12 border-t',
          isDark ? 'border-slate-800' : 'border-slate-200'
        )}
      >
        <div className='max-w-4xl mx-auto px-6'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
            <Link
              href='/'
              className={cn(
                'flex items-center gap-2 font-medium transition-colors',
                isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
              Back to Home
            </Link>
            <p className={isDark ? 'text-slate-500' : 'text-slate-400'}>
              © 2024 Your Business
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function DefaultContent({
  slug,
  isDark,
  color,
}: {
  slug: string
  isDark: boolean
  color: string
}) {
  // Generate placeholder content based on the page type
  const contentMap: Record<string, React.ReactNode> = {
    about: (
      <div className='space-y-8'>
        <section>
          <h2
            className={cn(
              'text-3xl font-bold mb-4',
              isDark ? 'text-white' : 'text-slate-900'
            )}
          >
            Our Story
          </h2>
          <p className={cn('text-lg leading-relaxed', isDark ? 'text-slate-300' : 'text-slate-600')}>
            Founded with a vision to transform the industry, we&apos;ve grown from a small team
            to a global organization. Our commitment to excellence and innovation drives
            everything we do.
          </p>
        </section>
        <section>
          <h2
            className={cn(
              'text-3xl font-bold mb-4',
              isDark ? 'text-white' : 'text-slate-900'
            )}
          >
            Our Mission
          </h2>
          <p className={cn('text-lg leading-relaxed', isDark ? 'text-slate-300' : 'text-slate-600')}>
            To deliver exceptional value to our customers through innovative solutions,
            unwavering quality, and outstanding service. We believe in building lasting
            relationships based on trust and mutual success.
          </p>
        </section>
      </div>
    ),
    services: (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {['Consulting', 'Development', 'Design', 'Support'].map((service, i) => (
          <div
            key={service}
            className={cn(
              'p-6 rounded-2xl',
              isDark ? 'bg-slate-800/50' : 'bg-slate-50'
            )}
          >
            <div
              className='w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-white font-bold'
              style={{ backgroundColor: color, opacity: 0.7 + i * 0.1 }}
            >
              {i + 1}
            </div>
            <h3
              className={cn(
                'text-xl font-bold mb-2',
                isDark ? 'text-white' : 'text-slate-900'
              )}
            >
              {service}
            </h3>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Professional {service.toLowerCase()} services tailored to your needs.
            </p>
          </div>
        ))}
      </div>
    ),
    products: (
      <div className='space-y-8'>
        <p className={cn('text-lg', isDark ? 'text-slate-300' : 'text-slate-600')}>
          Explore our range of products designed to meet your needs.
        </p>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {['Product A', 'Product B', 'Product C'].map((product, i) => (
            <div
              key={product}
              className={cn(
                'p-6 rounded-2xl text-center',
                isDark ? 'bg-slate-800/50' : 'bg-slate-50'
              )}
            >
              <div
                className='w-full aspect-square rounded-xl mb-4 flex items-center justify-center'
                style={{ backgroundColor: `${color}30` }}
              >
                <span className='text-4xl'>📦</span>
              </div>
              <h3
                className={cn(
                  'text-lg font-bold mb-1',
                  isDark ? 'text-white' : 'text-slate-900'
                )}
              >
                {product}
              </h3>
              <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
                Starting at $99
              </p>
            </div>
          ))}
        </div>
      </div>
    ),
    contact: (
      <div className='space-y-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h2
              className={cn(
                'text-2xl font-bold mb-4',
                isDark ? 'text-white' : 'text-slate-900'
              )}
            >
              Get in Touch
            </h2>
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    isDark ? 'bg-slate-800' : 'bg-slate-100'
                  )}
                >
                  📧
                </div>
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  hello@yourbusiness.com
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    isDark ? 'bg-slate-800' : 'bg-slate-100'
                  )}
                >
                  📞
                </div>
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  +1 (555) 123-4567
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    isDark ? 'bg-slate-800' : 'bg-slate-100'
                  )}
                >
                  📍
                </div>
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  123 Business St, City, ST 12345
                </span>
              </div>
            </div>
          </div>
          <div
            className={cn(
              'p-6 rounded-2xl',
              isDark ? 'bg-slate-800/50' : 'bg-slate-50'
            )}
          >
            <h3
              className={cn(
                'text-lg font-bold mb-4',
                isDark ? 'text-white' : 'text-slate-900'
              )}
            >
              Send us a message
            </h3>
            <form className='space-y-4'>
              <input
                type='text'
                placeholder='Your Name'
                className={cn(
                  'w-full px-4 py-3 rounded-lg border',
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                )}
              />
              <input
                type='email'
                placeholder='Your Email'
                className={cn(
                  'w-full px-4 py-3 rounded-lg border',
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                )}
              />
              <textarea
                placeholder='Your Message'
                rows={4}
                className={cn(
                  'w-full px-4 py-3 rounded-lg border resize-none',
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                )}
              />
              <button
                type='submit'
                className='w-full px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-shadow'
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    ),
  }

  return (
    contentMap[slug] || (
      <div
        className={cn(
          'p-8 rounded-2xl text-center',
          isDark ? 'bg-slate-800/50' : 'bg-slate-50'
        )}
      >
        <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
          Content for this page is coming soon.
        </p>
      </div>
    )
  )
}

