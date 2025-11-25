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
}

export default function Generic2DPage({
  title,
  description,
  slug,
  color = '#3b82f6',
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

  // Render page-specific content based on slug
  const PageContent = getPageContent(slug, isDark, color)

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
        <div className='relative max-w-6xl mx-auto px-6 py-20 md:py-32'>
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
      <animated.main style={contentSpring}>
        {PageContent}
      </animated.main>

      {/* Footer Navigation */}
      <footer
        className={cn(
          'py-12 border-t',
          isDark ? 'border-slate-800' : 'border-slate-200'
        )}
      >
        <div className='max-w-6xl mx-auto px-6'>
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

function getPageContent(slug: string, isDark: boolean, color: string) {
  switch (slug) {
    case 'about':
      return <AboutContent isDark={isDark} color={color} />
    case 'services':
      return <ServicesContent isDark={isDark} />
    case 'products':
      return <ProductsContent isDark={isDark} />
    case 'contact':
      return <ContactContent isDark={isDark} color={color} />
    default:
      return <DefaultContent isDark={isDark} />
  }
}

// About Page Content - matches AboutSandbox
function AboutContent({ isDark, color }: { isDark: boolean; color: string }) {
  return (
    <div className='max-w-6xl mx-auto px-6 py-16 space-y-24'>
      {/* Section 1: About the Starter */}
      <section
        className={cn(
          'rounded-3xl p-8 md:p-12 border',
          isDark
            ? 'bg-white/5 border-white/10 backdrop-blur-xl'
            : 'bg-slate-50 border-slate-200'
        )}
      >
        <p className='text-sm uppercase tracking-[0.4em] text-teal-500 mb-4'>About The Starter</p>
        <p className={cn('text-2xl md:text-3xl leading-relaxed', isDark ? 'text-slate-100' : 'text-slate-800')}>
          This starter template accelerates your journey into immersive web experiences. Built with
          production-grade Three.js and React, it provides the foundation for stunning 3D product showcases,
          interactive configurators, and virtual showrooms.
        </p>
        <p className={cn('mt-6 text-lg', isDark ? 'text-slate-300' : 'text-slate-600')}>
          Every layout is optimized for storytelling, speed, and accessibility so your team can focus on content
          strategy instead of rebuilding infrastructure.
        </p>
      </section>

      {/* Section 2: Features Grid */}
      <section className='grid gap-8 md:grid-cols-2'>
        <div
          className={cn(
            'rounded-3xl p-8 border',
            isDark
              ? 'bg-[#0b1624]/80 border-white/5 backdrop-blur-xl'
              : 'bg-slate-50 border-slate-200'
          )}
        >
          <h3 className='text-2xl font-semibold text-teal-500 mb-6'>Enterprise-Ready 3D Solutions</h3>
          <ul className={cn('space-y-5', isDark ? 'text-slate-200' : 'text-slate-700')}>
            <li className='flex gap-3'>
              <span className='text-teal-500'>•</span>
              <span>Lightning-fast performance with optimized rendering</span>
            </li>
            <li className='flex gap-3'>
              <span className='text-teal-500'>•</span>
              <span>Responsive design that works across every device and touchpoint</span>
            </li>
            <li className='flex gap-3'>
              <span className='text-teal-500'>•</span>
              <span>SEO-friendly architecture with SSR support and analytics hooks</span>
            </li>
          </ul>
        </div>

        <div
          className={cn(
            'rounded-3xl p-8 border',
            isDark
              ? 'bg-[#112e36]/80 border-white/5 backdrop-blur-xl'
              : 'bg-teal-50 border-teal-200'
          )}
        >
          <h4 className='text-xl font-semibold text-amber-500 mb-4'>Perfect For</h4>
          <div className='grid grid-cols-2 gap-3 text-sm'>
            {['E-commerce', 'Real Estate', 'Product Design', 'Architecture'].map((industry) => (
              <div
                key={industry}
                className={cn(
                  'rounded-2xl px-4 py-3 text-center',
                  isDark ? 'bg-white/10 text-white' : 'bg-white text-slate-700'
                )}
              >
                {industry}
              </div>
            ))}
          </div>
          <p className={cn('text-sm mt-5', isDark ? 'text-slate-200' : 'text-slate-600')}>
            From concept to deployment, we handle the technical complexity while you focus on your business
            goals.
          </p>
        </div>
      </section>

      {/* Section 3: CTA */}
      <section
        className={cn(
          'text-center rounded-3xl p-10 border',
          isDark
            ? 'bg-gradient-to-br from-[#1a535c]/90 to-[#0b1624]/90 border-white/10 backdrop-blur-xl'
            : 'bg-gradient-to-br from-teal-100 to-slate-100 border-slate-200'
        )}
      >
        <h5 className='text-sm uppercase tracking-[0.4em] text-amber-500 mb-4'>Scale With Confidence</h5>
        <p className={cn('text-lg md:text-xl leading-relaxed mb-6', isDark ? 'text-slate-100' : 'text-slate-800')}>
          Ready to scale?{' '}
          <a
            href='https://ewj.dev'
            className='text-amber-500 underline underline-offset-4 hover:text-amber-400'
            target='_blank'
            rel='noopener noreferrer'
          >
            ewj.dev
          </a>{' '}
          offers custom development services to build comprehensive 3D applications tailored to your business
          needs.
        </p>
        <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
          Extend this starter with bespoke commerce integrations, configurators, analytics, and storytelling
          moments crafted by a partner who ships production-ready immersive experiences every week.
        </p>
      </section>
    </div>
  )
}

// Services Page Content - matches ServicesSandbox
function ServicesContent({ isDark }: { isDark: boolean }) {
  const services = [
    {
      title: 'Web Development',
      description: 'Building scalable, performant, and accessible web applications using modern technologies.',
      color: '#ffe66d',
      icon: '🚀',
    },
    {
      title: 'Digital Strategy',
      description: 'Crafting data-driven strategies to grow your business and reach your target audience effectively.',
      color: '#1a535c',
      icon: '📊',
    },
    {
      title: 'UI/UX Design',
      description: 'Designing intuitive and engaging user interfaces that provide exceptional user experiences.',
      color: '#ff6b6b',
      icon: '🎨',
    },
  ]

  return (
    <div className='max-w-6xl mx-auto px-6 py-16'>
      <div className='space-y-16'>
        {services.map((service, i) => (
          <section
            key={service.title}
            className={cn(
              'flex flex-col md:flex-row gap-8 items-center',
              i % 2 === 1 && 'md:flex-row-reverse'
            )}
          >
            {/* Visual */}
            <div
              className='w-full md:w-1/2 aspect-square max-w-md rounded-3xl flex items-center justify-center text-8xl'
              style={{ backgroundColor: `${service.color}20` }}
            >
              {service.icon}
            </div>

            {/* Content */}
            <div className='w-full md:w-1/2'>
              <h2
                className='text-4xl font-bold mb-4'
                style={{ color: service.color }}
              >
                {service.title}
              </h2>
              <p className={cn('text-xl', isDark ? 'text-slate-300' : 'text-slate-600')}>
                {service.description}
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

// Products Page Content - matches ProductsSandbox
function ProductsContent({ isDark }: { isDark: boolean }) {
  const products = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    name: `Air Max ${i + 1}`,
    price: 199 + i * 20,
    color: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#1a535c', '#ff9f1c', '#6fffe9'][i % 6],
    description: [
      'Lightweight comfort met with iconic design.',
      'Maximum bounce for your daily run.',
      'Urban style redefined for the modern era.',
      'Pro performance for serious athletes.',
      'Limited edition colorway for collectors.',
      'Classic silhouette with modern tech.',
    ][i % 6],
  }))

  return (
    <div className='max-w-6xl mx-auto px-6 py-16'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {products.map((product) => (
          <div
            key={product.id}
            className={cn(
              'rounded-3xl p-6 border transition-all duration-300 hover:scale-105',
              isDark
                ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                : 'bg-white border-slate-200 shadow-sm hover:shadow-lg'
            )}
          >
            {/* Product Image Placeholder */}
            <div
              className='aspect-square rounded-2xl mb-4 flex items-center justify-center'
              style={{ backgroundColor: `${product.color}20` }}
            >
              <span className='text-6xl'>👟</span>
            </div>

            {/* Product Info */}
            <h3
              className='text-xl font-bold mb-1'
              style={{ color: product.color }}
            >
              {product.name}
            </h3>
            <p className={cn('text-sm mb-3', isDark ? 'text-slate-400' : 'text-slate-500')}>
              {product.description}
            </p>
            <div className='flex items-center justify-between'>
              <span className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                ${product.price}
              </span>
              <button
                className='px-4 py-2 rounded-full text-sm font-medium transition-colors'
                style={{
                  backgroundColor: product.color,
                  color: product.color === '#ffe66d' || product.color === '#6fffe9' ? '#0b0d12' : '#ffffff',
                }}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Contact Page Content - matches ContactSandbox
function ContactContent({ isDark, color }: { isDark: boolean; color: string }) {
  return (
    <div className='max-w-4xl mx-auto px-6 py-16'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
        {/* Contact Info */}
        <div>
          <h2 className={cn('text-3xl font-bold mb-6', isDark ? 'text-white' : 'text-slate-900')}>
            Get in Touch
          </h2>
          <p className={cn('mb-8', isDark ? 'text-slate-300' : 'text-slate-600')}>
            Ready to start your project? Send us a message and we&apos;ll get back to you as soon as possible.
          </p>

          <div className='space-y-4'>
            <div className='flex items-center gap-4'>
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  isDark ? 'bg-slate-800' : 'bg-slate-100'
                )}
              >
                📧
              </div>
              <div>
                <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>Email</p>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>hello@yourbusiness.com</p>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  isDark ? 'bg-slate-800' : 'bg-slate-100'
                )}
              >
                📞
              </div>
              <div>
                <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>Phone</p>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  isDark ? 'bg-slate-800' : 'bg-slate-100'
                )}
              >
                📍
              </div>
              <div>
                <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>Location</p>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>123 Business St, City, ST 12345</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div
          className={cn(
            'rounded-3xl p-8 border',
            isDark
              ? 'bg-white/5 border-white/10 backdrop-blur-xl'
              : 'bg-slate-50 border-slate-200'
          )}
        >
          <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-slate-300' : 'text-slate-700')}>
                Your Email
              </label>
              <input
                type='email'
                placeholder='you@example.com'
                className={cn(
                  'w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2',
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:ring-teal-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-teal-500'
                )}
              />
            </div>
            <div>
              <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-slate-300' : 'text-slate-700')}>
                Tell us about your idea...
              </label>
              <textarea
                rows={5}
                placeholder='Describe your project...'
                className={cn(
                  'w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2',
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:ring-teal-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-teal-500'
                )}
              />
            </div>
            <button
              type='submit'
              className='w-full py-3 rounded-xl font-semibold text-white transition-colors'
              style={{ backgroundColor: color }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// Default content for unknown pages
function DefaultContent({ isDark }: { isDark: boolean }) {
  return (
    <div className='max-w-4xl mx-auto px-6 py-16'>
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
    </div>
  )
}
