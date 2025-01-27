import { SafeAreaView, Text } from "react-native";
import { useActiveAccount } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";

export default function HomeScreen() {
  const account = useActiveAccount();
  return (
    <SafeAreaView className="flex-col flex-1 w-full items-center justify-center bg-background">
      <Text className="text-3xl font-bold text-primary">Deposit</Text>
      {account && (
        <Text className="text-lg text-secondary">
          {shortenAddress(account.address)}
        </Text>
      )}
    </SafeAreaView>
  );
}
