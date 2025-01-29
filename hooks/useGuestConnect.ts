import { useEffect } from "react";
import { useAutoConnect, useConnect } from "thirdweb/react";
import { client, inApp } from "../constants/thirdweb";

export function useGuestConnect() {
  const connectMutation = useConnect();
  const autoConnecQuery = useAutoConnect({
    client,
    wallets: [inApp],
  });
  useEffect(() => {
    if (autoConnecQuery.data || autoConnecQuery.isLoading) {
      return;
    }
    // if not autoconnected, login as guest
    connectMutation.connect(async () => {
      await inApp.connect({
        strategy: "guest",
        client,
      });
      return inApp;
    });
  }, [autoConnecQuery.data, autoConnecQuery.isLoading]);

  return {
    isConnecting: autoConnecQuery.isLoading || connectMutation.isConnecting,
  };
}
