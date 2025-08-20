import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import Providers from './providers'

export const metadata = {
  title: 'Jismya Admin Dashboard',
  description:
    'Professional admin dashboard for managing your business operations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <AuthProvider>
              <Providers>{children}</Providers>
            </AuthProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
