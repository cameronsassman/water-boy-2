import './globals.css';
import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { Trophy } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Water Polo Tournament',
  description: 'U14 Water Polo Tournament Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-blue-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <h1 className="text-3xl font-bold flex items-center">
                <Trophy className="mr-3" />
                U14 Water Polo Tournament
              </h1>
            </div>
          </header>

          {/* Navigation */}
          <Navigation />

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}