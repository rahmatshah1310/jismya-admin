import './globals.css'
import AuthLayout from './authlayout'
import Providers from './providers'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'

// const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Jismya.com - Premium Women's Undergarments",
  description: 'Premium quality undergarments for the modern woman. Available all over Pakistan!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body>
        <CartProvider><AuthProvider><AuthLayout><Providers>{children}</Providers></AuthLayout></AuthProvider></CartProvider>
      </body>
    </html>
  )
}
