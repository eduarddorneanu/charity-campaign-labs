import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygonMumbai } from "viem/chains";

export const walletClient = createWalletClient({
  transport: custom(window.ethereum),
  chain: polygonMumbai,
});

export const publicClient = createPublicClient({
  transport: http(),
  chain: polygonMumbai,
});
