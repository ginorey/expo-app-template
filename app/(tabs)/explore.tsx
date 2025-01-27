import { SafeAreaView, Text } from "react-native";
import { useActiveAccount } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";

export default function TabTwoScreen() {
  const account = useActiveAccount();
  return (
    <SafeAreaView className="flex-col flex-1 items-center justify-center bg-background">
      <Text className="text-3xl font-bold text-primary">Withdaw</Text>
      {account && (
        <Text className="text-lg text-secondary">
          {shortenAddress(account.address)}
        </Text>
      )}
    </SafeAreaView>
  );
}
