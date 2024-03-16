//import { http, createConfig } from 'wagmi'
import { localhost, polygonMumbai } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// export const config = createConfig({
//   chains: [localhost, polygonMumbai],
//   transports: {
//     [localhost.id]: http(),
//     [polygonMumbai.id]: http(),
//   },
//   ssr: true, // If your dApp uses server side rendering (SSR)
// })

export const config = getDefaultConfig({
  appName: 'Ringbook',
  projectId: process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID as string,
  chains: [localhost, polygonMumbai],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
