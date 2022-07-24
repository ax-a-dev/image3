import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultWallets, darkTheme } from "@rainbow-me/rainbowkit";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import Head from "next/head";

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.goerli,
    chain.rinkeby,
  ],
  [
    alchemyProvider({
      alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Image3",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const dark = createTheme({
  type: 'dark'
})

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <NextUIProvider theme={dark}>
        <RainbowKitProvider chains={chains} theme={darkTheme()} initialChain={chain.goerli} showRecentTransactions={true}>
          <Head><title>Image3</title></Head>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </NextUIProvider>
    </WagmiConfig>
  );
}

export default MyApp;
