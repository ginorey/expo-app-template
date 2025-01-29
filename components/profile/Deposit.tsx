import { Text, View } from "react-native";
import {
  AccountAddress,
  AccountProvider,
  useActiveAccount,
} from "thirdweb/react";
import { Colors } from "../../constants/colors";
import { client } from "../../constants/thirdweb";

export default function Deposit() {
  const account = useActiveAccount();

  if (!account) {
    return (
      <Text className="text-primary font-bold text-lg">No account found</Text>
    );
  }

  return (
    <AccountProvider address={account.address} client={client}>
      <View className="flex-1 items-center justify-center bg-background">
        <AccountAddress style={{ fontSize: 14, color: Colors.primary }} />
      </View>
    </AccountProvider>
  );
}
