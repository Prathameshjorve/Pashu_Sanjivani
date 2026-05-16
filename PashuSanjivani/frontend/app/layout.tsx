import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

import Chatbot from '@/components/chatbot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pashu Sanjivani - Livestock Health & Prediction',
  description: 'Report livestock symptoms and get disease predictions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}
