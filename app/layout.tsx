'use client';
import { Inter } from 'next/font/google';
import './globals.css';
import { config } from '../config';

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

const queryClient = new QueryClient();

const inter = Inter({ subsets: ['latin'] });

const Navbar = () => {
  return (
    <nav className="border flex justify-between items-center py-2 px-10 shadow-lg">
      <Link href="/" className="text-xl font-semibold flex-auto">
        DZap
      </Link>
      <div className="flex justify-between items-center gap-5 ">
        <ConnectButton />
      </div>
    </nav>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} `}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <div className="flex flex-col h-[100vh]">
                <Navbar />
                {children}
              </div>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
