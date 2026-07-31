import type { Metadata } from 'next';
import '@/styles/globals.css';
import PWAInstallerAlert from '@/components/pwa/PWAInstallerAlert';

export const metadata: Metadata = {
  title: 'APT Smart-Health | Hospital Management & Telemedicine System',
  description: 'Gintaccen tsari mai amfani da fasahar PWA domin sauƙaƙe gudanar da asibitoci, alaƙar likitoci da marasa lafiya a sauƙaƙe da cikin tsaro.',
  manifest: '/manifest.json',
  themeColor: '#0284c7',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'APT Smart-Health',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ha">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        {/* PWA Prompt / Notification Alert */}
        <PWAInstallerAlert />
        
        {/* Main Content Area */}
        <main>{children}</main>
      </body>
    </html>
  );
}
