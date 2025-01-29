import { useConnectedWallets } from "thirdweb/react";

export function useExternalWallet() {
  const wallets = useConnectedWallets();
  const externalWallet = wallets.find((wallet) => wallet.id !== "inApp");
  return {
    wallet: externalWallet,
    account: externalWallet?.getAccount(),
  };
}
