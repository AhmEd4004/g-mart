export const dynamic = 'force-dynamic'

import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import localFont from 'next/font/local';
const poppins = localFont({
  src: [
    { path: '../public/fonts/Poppins-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/Poppins-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/Poppins-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../public/fonts/Poppins-Bold.ttf',    weight: '700', style: 'normal' },
  ],
  display: 'swap',     // optional; controls font‑display
  variable: '--font-poppins', // optional; CSS variable
});



export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
