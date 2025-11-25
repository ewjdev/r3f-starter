'use client'

import { useAppStore } from '@/store'
import { cn } from '@/utils'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Generic2DPageProps {
  title: string
  description: string
  slug: string
  detailSlug?: string
  color?: string
}

export default function Generic2DPage({ title, description, slug, detailSlug, color = '#3b82f6' }: Generic2DPageProps) {
  const mode = useAppStore((state) => state.mode)
  const isDark = mode === 'dark'

  return (
    <div
      className={cn(
        'min-h-screen font-stack relative z-10',
        isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900',
      )}
    >
      {/* Hero Header */}
      <header className='relative overflow-hidden'>
        <div
          className='absolute inset-0 opacity-20 pointer-events-none'
          style={{
            background: `radial-gradient(circle at 50% 0%, ${color}40 0%, transparent 70%)`,
          }}
        />
        <div className='relative max-w-6xl mx-auto px-6 py-20 md:py-32'>
          <Link
            href='/'
            className={cn(
              'inline-flex items-center gap-2 mb-12 text-sm font-medium tracking-wide uppercase transition-colors',
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900',
            )}
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M10 19l-7-7 7-7' />
            </svg>
            Back to Home
          </Link>

          <div className='flex flex-col md:flex-row gap-8 md:items-end md:justify-between'>
            <div className='max-w-3xl'>
              <h1
                className='text-5xl md:text-7xl font-bold mb-6 tracking-tight'
                style={{ color: isDark ? '#fff' : '#0f172a' }}
              >
                {title}
              </h1>
              <p
                className={cn(
                  'text-xl md:text-2xl leading-relaxed font-light',
                  isDark ? 'text-slate-300' : 'text-slate-600',
                )}
              >
                {description}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {slug === 'about' && <AboutContent isDark={isDark} color={color} />}
        {slug === 'services' && <ServicesContent isDark={isDark} />}
        {slug === 'products' && <ProductsContent isDark={isDark} detailSlug={detailSlug} />}
        {slug === 'contact' && <ContactContent isDark={isDark} color={color} />}
        {!['about', 'services', 'products', 'contact'].includes(slug) && <DefaultContent isDark={isDark} />}
      </main>

      {/* Footer Navigation */}
      <footer className={cn('py-12 border-t mt-24', isDark ? 'border-white/5' : 'border-slate-100')}>
        <div className='max-w-6xl mx-auto px-6'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
            <Link
              href='/'
              className={cn(
                'flex items-center gap-2 font-medium transition-colors text-sm',
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900',
              )}
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M10 19l-7-7 7-7' />
              </svg>
              Back to Home
            </Link>
            <p className={cn('text-sm', isDark ? 'text-slate-500' : 'text-slate-400')}>© 2024 Your Business</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// About Page Content
function AboutContent({ isDark, color }: { isDark: boolean; color: string }) {
  return (
    <div className='max-w-6xl mx-auto px-6 py-12 space-y-24'>
      {/* Section 1: Minimal Typography */}
      <section className='grid md:grid-cols-12 gap-12'>
        <div className='md:col-span-4'>
          <h2
            className={cn(
              'text-sm font-semibold tracking-wider uppercase mb-4',
              isDark ? 'text-slate-400' : 'text-slate-500',
            )}
          >
            The Mission
          </h2>
        </div>
        <div className='md:col-span-8 space-y-8'>
          <p
            className={cn(
              'text-2xl md:text-3xl font-light leading-normal',
              isDark ? 'text-slate-100' : 'text-slate-800',
            )}
          >
            We build digital experiences that bridge the gap between imagination and reality. Our focus is on delivering
            performance, accessibility, and stunning visuals.
          </p>
          <div className='grid grid-cols-2 gap-8 pt-8 border-t border-dashed border-slate-700/30'>
            <div>
              <div className='text-4xl font-bold mb-2' style={{ color }}>
                10+
              </div>
              <div className={isDark ? 'text-slate-400' : 'text-slate-500'}>Years Experience</div>
            </div>
            <div>
              <div className='text-4xl font-bold mb-2' style={{ color }}>
                100%
              </div>
              <div className={isDark ? 'text-slate-400' : 'text-slate-500'}>Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Cards */}
      <section className='grid md:grid-cols-3 gap-6'>
        {[
          { title: 'Innovation', desc: 'Pushing boundaries with WebGL.' },
          { title: 'Performance', desc: 'Optimized for every device.' },
          { title: 'Scalability', desc: 'Built to grow with your needs.' },
        ].map((item, i) => (
          <div
            key={i}
            className={cn(
              'p-8 rounded-2xl border transition-colors',
              isDark
                ? 'border-white/5 bg-white/5 hover:bg-white/10'
                : 'border-slate-100 bg-slate-50 hover:bg-slate-100',
            )}
          >
            <h3 className={cn('text-xl font-medium mb-3', isDark ? 'text-white' : 'text-slate-900')}>{item.title}</h3>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

// Services Page Content
function ServicesContent({ isDark }: { isDark: boolean }) {
  const services = [
    {
      title: 'Web Development',
      description: 'Building scalable, performant, and accessible web applications using modern technologies.',
      color: '#ffe66d',
      icon: 'Code',
    },
    {
      title: 'Digital Strategy',
      description: 'Crafting data-driven strategies to grow your business and reach your target audience effectively.',
      color: '#1a535c',
      icon: 'Chart',
    },
    {
      title: 'UI/UX Design',
      description: 'Designing intuitive and engaging user interfaces that provide exceptional user experiences.',
      color: '#ff6b6b',
      icon: 'Design',
    },
  ]

  return (
    <div className='max-w-6xl mx-auto px-6 py-12'>
      <div className='grid md:grid-cols-3 gap-8'>
        {services.map((service) => (
          <div
            key={service.title}
            className={cn(
              'group p-8 rounded-3xl border transition-all duration-300',
              isDark
                ? 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100',
            )}
          >
            <div
              className='w-12 h-12 rounded-xl mb-6 flex items-center justify-center text-lg font-bold'
              style={{ backgroundColor: `${service.color}20`, color: service.color }}
            >
              {service.title[0]}
            </div>
            <h2 className={cn('text-2xl font-bold mb-4', isDark ? 'text-white' : 'text-slate-900')}>{service.title}</h2>
            <p className={cn('text-base leading-relaxed', isDark ? 'text-slate-400' : 'text-slate-500')}>
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Products Page Content
function ProductsContent({ isDark, detailSlug }: { isDark: boolean; detailSlug?: string }) {
  const router = useRouter()
  const products = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    name: `Air Max ${i + 1}`,
    slug: `air-max-${i + 1}`,
    price: 199 + i * 20,
    color: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#1a535c', '#ff9f1c', '#6fffe9'][i % 6],
    category: ['Running', 'Lifestyle', 'Urban', 'Pro', 'Limited', 'Classic'][i % 6],
    description: [
      'Lightweight comfort met with iconic design.',
      'Maximum bounce for your daily run.',
      'Urban style redefined for the modern era.',
      'Pro performance for serious athletes.',
      'Limited edition colorway for collectors.',
      'Classic silhouette with modern tech.',
    ][i % 6],
    details: ['Breathable mesh upper', 'Responsive cushioning', 'Durable rubber outsole', 'Sustainable materials'],
  }))

  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    if (detailSlug) {
      const product = products.find((p) => p.slug === detailSlug)
      if (product) {
        setSelectedId(product.id)
      } else {
        // If slug is invalid, maybe redirect or just show list
        setSelectedId(null)
      }
    } else {
      setSelectedId(null)
    }
  }, [detailSlug])

  const handleSelectProduct = (productSlug: string) => {
    router.push(`/space/products/${productSlug}`, { scroll: false })
  }

  const handleBack = () => {
    router.push('/space/products', { scroll: false })
  }

  if (selectedId !== null) {
    const product = products.find((p) => p.id === selectedId)
    if (!product) return null

    return (
      <div className='max-w-6xl mx-auto px-6 py-12'>
        <button
          onClick={handleBack}
          className={cn(
            'mb-8 flex items-center gap-2 text-sm font-medium transition-colors',
            isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900',
          )}
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          Back to Products
        </button>

        <div className='grid md:grid-cols-2 gap-12 items-start'>
          <div
            className={cn(
              'aspect-square rounded-3xl flex items-center justify-center',
              isDark ? 'bg-white/5' : 'bg-slate-100',
            )}
            style={{ backgroundColor: `${product.color}10` }}
          >
            <span className='text-9xl' style={{ color: product.color }}>
              👟
            </span>
          </div>

          <div className='space-y-8'>
            <div>
              <div
                className={cn(
                  'text-sm font-medium uppercase tracking-wider mb-2',
                  isDark ? 'text-slate-400' : 'text-slate-500',
                )}
              >
                {product.category}
              </div>
              <h2 className={cn('text-4xl md:text-5xl font-bold mb-4', isDark ? 'text-white' : 'text-slate-900')}>
                {product.name}
              </h2>
              <p className={cn('text-xl', isDark ? 'text-slate-300' : 'text-slate-600')}>{product.description}</p>
            </div>

            <div className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>${product.price}</div>

            <div className='space-y-4'>
              <h3
                className={cn(
                  'text-sm font-semibold uppercase tracking-wider',
                  isDark ? 'text-slate-400' : 'text-slate-500',
                )}
              >
                Details
              </h3>
              <ul className='space-y-2'>
                {product.details.map((detail, i) => (
                  <li key={i} className={cn('flex items-center gap-3', isDark ? 'text-slate-300' : 'text-slate-600')}>
                    <span className='w-1.5 h-1.5 rounded-full bg-current opacity-50' />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div className='pt-8 border-t border-dashed border-slate-700/30'>
              <button
                className='w-full md:w-auto px-8 py-4 rounded-full font-medium text-white transition-transform active:scale-95 text-lg'
                style={{
                  backgroundColor: product.color,
                  color: product.color === '#ffe66d' || product.color === '#6fffe9' ? '#0b0d12' : '#ffffff',
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-6xl mx-auto px-6 py-12'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12'>
        {products.map((product) => (
          <button
            key={product.id}
            className='group cursor-pointer text-left w-full'
            onClick={() => handleSelectProduct(product.slug)}
          >
            <div
              className={cn(
                'aspect-4/5 rounded-3xl mb-6 transition-all duration-500 relative overflow-hidden',
                isDark ? 'bg-white/5' : 'bg-slate-100',
              )}
            >
              <div
                className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'
                style={{ backgroundColor: `${product.color}10` }}
              />
              <div className='absolute inset-0 flex items-center justify-center'>
                <span className='text-6xl opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110'>
                  👟
                </span>
              </div>
            </div>

            <div className='flex justify-between items-start'>
              <div>
                <p
                  className={cn(
                    'text-xs uppercase tracking-wider font-medium mb-1',
                    isDark ? 'text-slate-500' : 'text-slate-400',
                  )}
                >
                  {product.category}
                </p>
                <h3 className={cn('text-lg font-medium', isDark ? 'text-white' : 'text-slate-900')}>{product.name}</h3>
              </div>
              <span className={cn('text-lg', isDark ? 'text-slate-300' : 'text-slate-600')}>${product.price}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Contact Page Content
function ContactContent({ isDark, color }: { isDark: boolean; color: string }) {
  return (
    <div className='max-w-6xl mx-auto px-6 py-12'>
      <div className='grid md:grid-cols-2 gap-16 md:gap-24'>
        <div>
          <h2 className={cn('text-3xl font-bold mb-8', isDark ? 'text-white' : 'text-slate-900')}>Let's talk</h2>
          <form className='space-y-6' onSubmit={(e) => e.preventDefault()}>
            <div className='space-y-1'>
              <label className={cn('text-sm font-medium', isDark ? 'text-slate-400' : 'text-slate-500')}>Name</label>
              <input
                type='text'
                className={cn(
                  'w-full px-0 py-3 bg-transparent border-b transition-colors focus:outline-none focus:border-current',
                  isDark
                    ? 'border-slate-800 text-white focus:text-white'
                    : 'border-slate-200 text-slate-900 focus:text-black',
                )}
                style={{ caretColor: color }}
              />
            </div>
            <div className='space-y-1'>
              <label className={cn('text-sm font-medium', isDark ? 'text-slate-400' : 'text-slate-500')}>Email</label>
              <input
                type='email'
                className={cn(
                  'w-full px-0 py-3 bg-transparent border-b transition-colors focus:outline-none focus:border-current',
                  isDark
                    ? 'border-slate-800 text-white focus:text-white'
                    : 'border-slate-200 text-slate-900 focus:text-black',
                )}
              />
            </div>
            <div className='space-y-1'>
              <label className={cn('text-sm font-medium', isDark ? 'text-slate-400' : 'text-slate-500')}>Message</label>
              <textarea
                rows={4}
                className={cn(
                  'w-full px-0 py-3 bg-transparent border-b transition-colors focus:outline-none focus:border-current resize-none',
                  isDark
                    ? 'border-slate-800 text-white focus:text-white'
                    : 'border-slate-200 text-slate-900 focus:text-black',
                )}
              />
            </div>
            <button
              className='mt-8 px-8 py-4 rounded-full font-medium text-white transition-transform active:scale-95'
              style={{ backgroundColor: color }}
            >
              Send Message
            </button>
          </form>
        </div>

        <div className='space-y-12'>
          <div>
            <h3
              className={cn(
                'text-sm font-semibold uppercase tracking-wider mb-4',
                isDark ? 'text-slate-500' : 'text-slate-400',
              )}
            >
              Contact
            </h3>
            <p className={cn('text-lg', isDark ? 'text-white' : 'text-slate-900')}>hello@example.com</p>
            <p className={cn('text-lg', isDark ? 'text-white' : 'text-slate-900')}>+1 (555) 000-0000</p>
          </div>
          <div>
            <h3
              className={cn(
                'text-sm font-semibold uppercase tracking-wider mb-4',
                isDark ? 'text-slate-500' : 'text-slate-400',
              )}
            >
              Office
            </h3>
            <p className={cn('text-lg', isDark ? 'text-white' : 'text-slate-900')}>
              123 Design Street
              <br />
              Creative District
              <br />
              New York, NY 10012
            </p>
          </div>
          <div>
            <h3
              className={cn(
                'text-sm font-semibold uppercase tracking-wider mb-4',
                isDark ? 'text-slate-500' : 'text-slate-400',
              )}
            >
              Socials
            </h3>
            <div className='flex gap-4'>
              {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                <a
                  key={social}
                  href='#'
                  className={cn('text-lg hover:underline', isDark ? 'text-white' : 'text-slate-900')}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Default content for unknown pages
function DefaultContent({ isDark }: { isDark: boolean }) {
  return (
    <div className='max-w-4xl mx-auto px-6 py-16'>
      <div className={cn('p-8 rounded-2xl text-center', isDark ? 'bg-slate-800/50' : 'bg-slate-50')}>
        <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Content for this page is coming soon.</p>
      </div>
    </div>
  )
}
