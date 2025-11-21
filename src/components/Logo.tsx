'use client'

import Link from 'next/link'

const Logo = () => {
  return (
    <Link href='https://ewj.dev'>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 170 45' width='180' height='45'>
        <defs>
          <linearGradient id='wireframe-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' style={{ stopColor: '#00C6FF', stopOpacity: 1 }} />{' '}
            <stop offset='100%' style={{ stopColor: '#5856D6', stopOpacity: 1 }} />{' '}
          </linearGradient>

          <linearGradient id='text-gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
            <stop offset='100%' style={{ stopColor: '#dceeff', stopOpacity: 1 }} />
          </linearGradient>
          <style jsx global>{`
            /* General fonts */
            @import url('https://fonts.googleapis.com/css2?family=Stack+Sans+Notch:wght@200..700&display=swap');

            .svg-container {
              font-family:
                'Stack Sans Notch',
                -apple-system,
                BlinkMacSystemFont,
                sans-serif;
            }

            /* The Wireframe Cube Styling */
            .cube-line {
              fill: none;
              stroke: url(#wireframe-gradient);
              stroke-width: 2;
              stroke-linecap: round;
              stroke-linejoin: round;
              /* Prepare for draw animation */
              stroke-dasharray: 130;
              stroke-dashoffset: 130;
              opacity: 0.9;
            }

            /* The Text Styling */
            .brand-text {
              font-size: 24px;
              font-weight: 700;
              fill: url(#text-gradient);
              opacity: 0; /* Start hidden */
            }

            .brand-text-suffix {
              font-weight: 400;
              opacity: 0.7;
              animation: pulse 8s ease-in-out infinite 2s;
            }

            /* --- ANIMATION SEQUENCES --- */

            /* 1. Draw the wireframe lines */
            .cube-line-1 {
              animation:
                drawLine 1.2s ease-out forwards 0.2s,
                pulse 4s ease-in-out infinite 2s;
            }
            .cube-line-2 {
              animation:
                drawLine 1.2s ease-out forwards 0.4s,
                pulse 4s ease-in-out infinite 2s;
            }
            .cube-line-3 {
              animation:
                drawLine 1.2s ease-out forwards 0.6s,
                pulse 4s ease-in-out infinite 2s;
            }
            .cube-line-inner {
              animation:
                drawLine 1.2s ease-out forwards 0.9s,
                pulse 4s ease-in-out infinite 2s;
            }

            /* 2. Fade in and slide up the text */
            .brand-text {
              animation: textReveal 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards 1.1s;
            }

            /* Keyframes */
            @keyframes drawLine {
              to {
                stroke-dashoffset: 0;
              }
            }

            @keyframes textReveal {
              0% {
                opacity: 0;
                transform: translateY(10px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }

            /* A subtle breathing effect once the logo is built */
            @keyframes pulse {
              0%,
              100% {
                stroke-width: 2;
                opacity: 0.5;
              }
              50% {
                stroke-width: 2.75;
                opacity: 1;
                filter: drop-shadow(0px 0px 3px rgba(0, 198, 255, 0.5));
              }
            }

            /* Optional: Dark Mode Background for preview */
            /* svg { background-color: #0f172a; padding: 20px; border-radius: 8px;} */
          `}</style>
        </defs>

        <rect width='100%' height='100%' fill='#0f172a' rx='8' opacity='.2' />

        <g className='svg-container' transform='translate(8, 20)'>
          <g transform='translate(15, -25)' className='scale-55'>
            <path className='cube-line cube-line-1' d='M30 5 L55 17.5 L55 42.5' />
            <path className='cube-line cube-line-2' d='M55 42.5 L30 55 L5 42.5' />
            <path className='cube-line cube-line-3' d='M5 42.5 L5 17.5 L30 5' />

            <path className='cube-line cube-line-inner' d='M30 30 L30 55' />
            <path className='cube-line cube-line-inner' d='M30 30 L5 17.5' />
            <path className='cube-line cube-line-inner' d='M30 30 L55 17.5' />
          </g>

          <text x='60' y='12' className='brand-text'>
            ewj<tspan className='brand-text-suffix'>.dev</tspan>
          </text>
        </g>
      </svg>
    </Link>
  )
}

export default Logo
