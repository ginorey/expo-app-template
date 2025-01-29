import { createThirdwebClient, getContract } from "thirdweb";
import { base, baseSepolia } from "thirdweb/chains";
import { InAppWalletSocialAuth, WalletId, inAppWallet } from "thirdweb/wallets";

const clientId = process.env.EXPO_PUBLIC_THIRDWEB_CLIENT_ID!;

if (!clientId) {
  throw new Error(
    "Missing EXPO_PUBLIC_THIRDWEB_CLIENT_ID - make sure to set it in your .env file",
  );
}

export const client = createThirdwebClient({
  clientId,
});

export const chain = base;

export const inApp = inAppWallet({
  smartAccount: {
    chain,
    sponsorGas: true,
  },
});

export const authStrategies: InAppWalletSocialAuth[] = ["google"];
export const supportedWallets: WalletId[] = [
  "io.metamask",
  "me.rainbow",
  "io.zerion.wallet",
  "com.trustwallet.app",
];
