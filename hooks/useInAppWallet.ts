import { useConnectedWallets } from "thirdweb/react";

export function useInAppWallet() {
  const wallets = useConnectedWallets();
  const inAppWallet = wallets.find((wallet) => wallet.id === "inApp");
  return {
    wallet: inAppWallet,
    account: inAppWallet?.getAccount(),
  };
}
