import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, type AppKitNetwork } from "@reown/appkit/networks";
import { cookieStorage, createStorage } from "wagmi";

export const projectId = process.env.NEXT_PUBLIC_APPKIT_PROJECT_ID || "";

if (!projectId) {
  console.warn("[WalletConnect] NEXT_PUBLIC_APPKIT_PROJECT_ID is not set");
}

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId: projectId || "placeholder-id",
  networks,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
