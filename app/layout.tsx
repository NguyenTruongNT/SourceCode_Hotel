import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { BookingProvider } from '@/components/booking-context'
import { AuthProvider } from '@/components/auth-context'
import { AuthProvider as AdminAuthProvider } from '@/app/AuthProvider'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'THAD HOTEL — Đặt phòng khách sạn',
  description: 'Tìm phòng khách sạn lý tưởng tại THAD HOTEL. Đặt phòng nhanh chóng, trải nghiệm nghỉ dưỡng đẳng cấp.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable} bg-background`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AdminAuthProvider>
          <AuthProvider>
            <BookingProvider>
              {children}
            </BookingProvider>
          </AuthProvider>
        </AdminAuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}