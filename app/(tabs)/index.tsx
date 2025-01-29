import { Link } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { useActiveAccount } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { useInAppWallet } from "../../hooks/useInAppWallet";

export default function HomeScreen() {
  const { account } = useInAppWallet();
  return (
    <SafeAreaView className="flex-col flex-1 w-full items-center justify-center bg-background">
      <Text className="text-3xl font-bold text-primary">
        Ready to build your app?
      </Text>
      {account && (
        <>
          <Text className="text-lg text-primary mt-6">
            User is authenticated and ready to go!
          </Text>
          <Text className="text-lg text-secondary">
            Smart Wallet: {shortenAddress(account.address)}
          </Text>
          <Link href="/(tabs)/profile" className="text-link font-bold mt-6">
            View Profile
          </Link>
        </>
      )}
    </SafeAreaView>
  );
}
