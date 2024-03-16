import { localhost, polygonMumbai } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

export const config = getDefaultConfig({
  appName: 'DZap MT3 Staking',
  projectId: (process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID as string) || 'demo',
  chains: [localhost, polygonMumbai],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
