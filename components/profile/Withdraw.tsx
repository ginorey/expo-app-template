import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NATIVE_TOKEN_ADDRESS, prepareTransaction } from "thirdweb";
import { resolveAddress } from "thirdweb/extensions/ens";
import { convertCryptoToFiat } from "thirdweb/pay";
import {
  AccountAvatar,
  AccountBalance,
  AccountBlobbie,
  AccountProvider,
  useSendTransaction,
  useWalletBalance,
} from "thirdweb/react";
import { shortenHex } from "thirdweb/utils";
import { Colors } from "../../constants/colors";
import { chain, client } from "../../constants/thirdweb";
import { useExternalWallet } from "../../hooks/useExternalWallet";
import { useInAppWallet } from "../../hooks/useInAppWallet";

export default function Withdraw() {
  const { account } = useInAppWallet();
  const { account: externalAccount } = useExternalWallet();
  const [recipientAddress, setRecipientAddress] = useState(
    externalAccount?.address || "",
  );
  const [amountUSD, setAmountUSD] = useState("");
  const [amountETH, setAmountETH] = useState(0n);
  const [totalBalanceUSD, setTotalBalanceUSD] = useState(0);
  const balanceQuery = useWalletBalance({
    client,
    address: account?.address,
    chain,
  });
  const sendTransactionMutation = useSendTransaction();

  useEffect(() => {
    const convertBalanceToUSD = async () => {
      if (!balanceQuery.data?.displayValue) {
        return;
      }
      const usd = await convertCryptoToFiat({
        fromTokenAddress: NATIVE_TOKEN_ADDRESS,
        to: "USD",
        fromAmount: Number(balanceQuery.data?.displayValue),
        chain,
        client,
      });
      setTotalBalanceUSD(usd.result);
    };
    convertBalanceToUSD();
  }, [balanceQuery.data]);

  if (!account) {
    return (
      <View className="flex-col items-center justify-center">
        <Text className="text-primary">No account connected</Text>
      </View>
    );
  }

  const handlePercentageSelect = (percentage: number) => {
    const amountUSD = (totalBalanceUSD * percentage) / 100;
    const amountETH =
      ((balanceQuery.data?.value || 0n) * BigInt(percentage)) / 100n;

    setAmountUSD(`$${amountUSD.toFixed(2)}`);
    setAmountETH(amountETH);
  };

  const handleWithdraw = async () => {
    if (!amountETH) {
      return;
    }
    const resolvedAddress = await resolveAddress({
      name: recipientAddress,
      client,
    });
    const transaction = prepareTransaction({
      to: resolvedAddress,
      value: amountETH,
      chain,
      client,
    });
    sendTransactionMutation.mutate(transaction);
  };

  return (
    <AccountProvider address={account.address} client={client}>
      <View className="flex-1 flex-col items-center justify-center p-6 gap-y-8">
        {/* Avatar Section */}
        <View className="flex-col items-center justify-center">
          <AccountAvatar
            loadingComponent={
              <AccountBlobbie size={92} style={{ borderRadius: 100 }} />
            }
            fallbackComponent={
              <AccountBlobbie size={92} style={{ borderRadius: 100 }} />
            }
            style={{
              width: 92,
              height: 92,
              borderRadius: 100,
            }}
          />
        </View>

        {/* Balance Section */}
        <View className="flex-col items-center justify-center">
          <Text className="text-lg text-secondary">Available Balance</Text>
          <AccountBalance
            showBalanceInFiat="USD"
            chain={chain}
            loadingComponent={
              <ActivityIndicator
                size="large"
                color={Colors.accent}
                style={{ margin: 16 }}
              />
            }
            fallbackComponent={
              <Text className="text-primary">Failed to load balance</Text>
            }
            style={{
              color: "white",
              fontSize: 36,
              fontWeight: "bold",
            }}
            queryOptions={{
              refetchInterval: 5000,
            }}
          />
        </View>

        {/* Recipient Address Input */}
        <View className="w-full flex-col gap-y-4">
          <Text className="text-primary font-bold">Recipient Address</Text>
          <TextInput
            className="w-full bg-backgroundSecondary text-primary p-4 rounded-lg"
            placeholder="Address or ENS"
            placeholderTextColor={Colors.secondary}
            value={recipientAddress}
            onChangeText={setRecipientAddress}
          />
        </View>

        {/* Amount Selection */}
        <View className="w-full flex-col gap-y-4">
          <Text className="text-primary font-bold">Amount</Text>
          <View className="flex-row justify-between gap-x-4">
            {[25, 50, 100].map((percentage) => (
              <TouchableOpacity
                key={percentage}
                className="flex-1 bg-backgroundSecondary p-3 rounded-lg items-center"
                onPress={() => handlePercentageSelect(percentage)}
              >
                <Text className="text-primary font-bold">{percentage}%</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            className="w-full bg-backgroundSecondary text-primary p-4 rounded-lg"
            placeholder="$0.00"
            placeholderTextColor={Colors.secondary}
            keyboardType="decimal-pad"
            value={amountUSD}
            onChangeText={setAmountUSD}
          />
        </View>

        {/* Withdraw Button */}
        <TouchableOpacity
          className="w-full bg-accent p-4 rounded-lg items-center"
          onPress={handleWithdraw}
          disabled={sendTransactionMutation.isPending}
          style={{ opacity: sendTransactionMutation.isPending ? 0.5 : 1 }}
        >
          <View className="flex-row items-center gap-x-2">
            <FontAwesome5 name="angle-double-up" size={20} color="white" />
            <Text className="text-white font-bold text-lg">
              {sendTransactionMutation.isPending
                ? "Withdrawing..."
                : `Withdraw ${amountUSD}`}
            </Text>
          </View>
        </TouchableOpacity>

        {sendTransactionMutation.isError && (
          <Text className="text-red-500">
            {sendTransactionMutation.error.message}
          </Text>
        )}

        {sendTransactionMutation.isSuccess && (
          <Pressable
            onPress={() =>
              Linking.openURL(
                `${chain.blockExplorers?.[0]?.url}/tx/${sendTransactionMutation.data?.transactionHash}`,
              )
            }
          >
            <Text className="text-green-500 underline">
              Trasaction sent:{" "}
              {shortenHex(sendTransactionMutation.data?.transactionHash)}
            </Text>
          </Pressable>
        )}
      </View>
    </AccountProvider>
  );
}
