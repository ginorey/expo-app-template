import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { Text, TouchableOpacity, View } from "react-native";
import {
  NATIVE_TOKEN_ADDRESS,
  prepareTransaction,
  sendTransaction,
  toWei,
} from "thirdweb";
import { convertFiatToCrypto } from "thirdweb/pay";
import {
  AccountAddress,
  AccountAvatar,
  AccountBlobbie,
  AccountProvider,
  useConnect,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { createWallet } from "thirdweb/wallets";
import { Colors } from "../../constants/colors";
import { chain, client } from "../../constants/thirdweb";
import { useExternalWallet } from "../../hooks/useExternalWallet";
import { useInAppWallet } from "../../hooks/useInAppWallet";

export default function Deposit() {
  const { account } = useInAppWallet();

  const copyAddressToClipboard = async () => {
    if (account) {
      await Clipboard.setStringAsync(account.address);
    }
  };

  if (!account) {
    return (
      <Text className="text-primary font-bold text-lg">No account found</Text>
    );
  }

  return (
    <AccountProvider address={account.address} client={client}>
      <View className="flex-1 items-center justify-center px-6">
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

          <QuickDeposit />

          <View className="w-full flex-row items-center justify-center gap-4 mt-8">
            <View className="flex-1 h-[1px] bg-border" />
            <Text className="text-secondary font-medium">OR</Text>
            <View className="flex-1 h-[1px] bg-border" />
          </View>

          <Text className="text-2xl text-primary font-bold mt-8 mb-2">
            Deposit Funds Manually
          </Text>

          <Text className="text-secondary text-center mb-4">
            Send funds to this address on the{" "}
            <Text className="font-bold text-accent underline">
              {chain.name}
            </Text>{" "}
            network
          </Text>

          <AccountAddress
            style={{
              fontSize: 14,
              color: Colors.primary,
              textAlign: "center",
              marginBottom: 16,
            }}
          />

          <TouchableOpacity
            onPress={copyAddressToClipboard}
            className="flex-row items-center justify-center gap-2 bg-backgroundSecondary rounded-lg p-4"
          >
            <Ionicons name="copy-outline" size={20} color={Colors.accent} />
            <Text className="text-primary font-bold text-lg">Copy Address</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AccountProvider>
  );
}

function QuickDeposit() {
  const { account: localAccount } = useInAppWallet();
  const { connect } = useConnect();
  const { account: payerAccount } = useExternalWallet();

  const depositMutation = useMutation({
    mutationFn: async (amountUSD: number) => {
      if (!localAccount) {
        throw new Error("No local account found");
      }
      if (!payerAccount) {
        throw new Error("No payer account found");
      }
      const amountInEth = await convertFiatToCrypto({
        from: "USD",
        fromAmount: amountUSD,
        to: NATIVE_TOKEN_ADDRESS,
        chain,
        client,
      });
      console.log(amountInEth);
      const transaction = prepareTransaction({
        to: localAccount.address,
        value: toWei(amountInEth.result.toString()),
        chain,
        client,
      });
      const result = await sendTransaction({
        transaction,
        account: payerAccount,
      });
      console.log(result);
      return result;
    },
  });

  const connectPayer = async () => {
    await connect(async () => {
      const wc = createWallet("me.rainbow");
      await wc.connect({ client, chain });
      return wc;
    });
  };

  const deposit = async (amount: number) => {
    await depositMutation.mutateAsync(amount);
  };

  return (
    <>
      <Text className="text-2xl text-primary font-bold mt-8 mb-4">
        Quick Deposit
      </Text>

      {!payerAccount && (
        <View className="flex-col items-center justify-center gap-4">
          <Text className="text-secondary text-center mb-4">
            Connect to a wallet to deposit funds
          </Text>
          <TouchableOpacity
            onPress={connectPayer}
            className="flex-row items-center justify-center gap-2 bg-backgroundSecondary rounded-lg p-4"
          >
            <Ionicons name="wallet-outline" size={20} color={Colors.accent} />
            <Text className="text-primary font-bold text-lg">
              Connect Wallet
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {payerAccount && (
        <Text className="text-secondary text-center mb-4">
          Connected to {shortenAddress(payerAccount.address)}
        </Text>
      )}

      {payerAccount && (
        <View className="flex-row items-center justify-center gap-4">
          <QuickDepositButton amount={10} onClick={deposit} />
          <QuickDepositButton amount={20} onClick={deposit} />
          <QuickDepositButton amount={50} onClick={deposit} />
          <QuickDepositButton amount={100} onClick={deposit} />
        </View>
      )}
    </>
  );
}

function QuickDepositButton({
  amount,
  onClick,
}: {
  amount: number;
  onClick: (amount: number) => void;
}) {
  return (
    <TouchableOpacity
      className="flex-col items-center justify-center bg-backgroundSecondary rounded-lg p-4 w-20"
      onPress={() => onClick(amount)}
    >
      <Text className="text-primary font-bold text-lg">${amount}</Text>
    </TouchableOpacity>
  );
}
