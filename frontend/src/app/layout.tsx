import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PACT - Predictive AI-Backed Commitment Technology',
  description: 'A premium micro-agreement platform for everyday commitments verified with Face ID.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50 flex flex-col`}>
        <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-bold leading-none">P</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900">ACT</span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <a href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">How it works</a>
                <a href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Features</a>
                <a href="/auth" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">Sign In</a>
                <a href="/auth" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all">
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-100 mt-auto py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <p className="text-sm text-gray-400">© 2026 PACT Technology. All rights reserved.</p>
            <div className="flex space-x-2 text-sm text-gray-400">
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> System Operational</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
