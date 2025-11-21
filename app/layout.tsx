import { Layout } from '@/components/dom/Layout'
import '@/global.css'
import Logo from '@/components/Logo'

export const metadata = {
  title: 'Starter project for Nextjs + React-three-fiber ',
  description: 'A comprehensive starter project for Nextjs + React-three-fiber and Threejs.',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='antialiased w-full h-full'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className='w-full h-full'>
        {/* To avoid FOUT with styled-components wrap Layout with StyledComponentsRegistry https://beta.nextjs.org/docs/styling/css-in-js#styled-components */}

        <Layout>{children}</Layout>
        <div className='absolute bottom-2 right-0 z-10001'>
          <Logo />
        </div>
      </body>
    </html>
  )
}
