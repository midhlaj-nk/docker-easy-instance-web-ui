import { Poppins } from "next/font/google";
import "./globals.css";
import "./font.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./components/ThemeProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Optimized: Only load used weights
  display: 'swap', // Improve perceived performance
  preload: true,
});

export const metadata = {
  title: {
    default: 'Easy Instance - Deploy Odoo in Seconds',
    template: '%s | Easy Instance',
  },
  description: 'Launch Odoo instances instantly on Kubernetes. Scale without limits, automatic updates, enterprise-grade security.',
  keywords: ['Odoo', 'Kubernetes', 'Cloud Hosting', 'ERP', 'SaaS', 'Easy Instance', 'Odoo Deployment'],
  authors: [{ name: 'Cybrosys', url: 'https://www.cybrosys.com' }],
  openGraph: {
    title: 'Easy Instance - Deploy Odoo in Seconds',
    description: 'Launch Odoo instances instantly on Kubernetes',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo/logo.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
