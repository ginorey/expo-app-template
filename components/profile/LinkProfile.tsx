import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import {
  SocialIcon,
  WalletIcon,
  WalletName,
  WalletProvider,
  useLinkProfile,
} from "thirdweb/react";
import {
  InAppWalletSocialAuth,
  WalletId,
  createWallet,
} from "thirdweb/wallets";
import { Colors } from "../../constants/colors";
import { chain, client } from "../../constants/thirdweb";

const strategies: InAppWalletSocialAuth[] = ["google", "farcaster", "x"];
const wallets: WalletId[] = [
  "io.metamask",
  "me.rainbow",
  "com.coinbase.wallet",
];

export default function LinkProfile() {
  const {
    mutate: linkProfile,
    isPending: isLinkingProfile,
    error,
  } = useLinkProfile();

  if (isLinkingProfile) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-col px-4 py-8">
      <View className="flex-col items-start justify-start gap-4">
        {strategies.map((strategy) => (
          <SocialLinkButton
            strategy={strategy}
            linkProfile={linkProfile}
            isLinkingProfile={isLinkingProfile}
            error={error}
            key={strategy}
          />
        ))}
        {wallets.map((walletId) => (
          <WalletLinkButton
            walletId={walletId}
            linkProfile={linkProfile}
            key={walletId}
          />
        ))}
      </View>
    </View>
  );
}

function SocialLinkButton({
  strategy,
  linkProfile,
}: {
  strategy: InAppWalletSocialAuth;
  linkProfile: ReturnType<typeof useLinkProfile>["mutate"]; // TODO change to onclick
  isLinkingProfile: boolean;
  error: Error | null;
}) {
  const linkSocial = () => {
    linkProfile({
      client,
      strategy,
    });
  };

  return (
    <TouchableOpacity
      className="w-full flex-row items-center justify-start py-4 px-6 bg-backgroundSecondary rounded-lg gap-4"
      onPress={linkSocial}
    >
      <SocialIcon
        provider={strategy}
        width={42}
        height={42}
        style={{ borderRadius: 4 }}
      />
      <Text className="text-primary font-bold">
        {strategy.charAt(0).toUpperCase() + strategy.slice(1)}
      </Text>
    </TouchableOpacity>
  );
}

function WalletLinkButton({
  walletId,
  linkProfile,
}: {
  walletId: WalletId;
  linkProfile: ReturnType<typeof useLinkProfile>["mutate"];
}) {
  const linkWallet = () => {
    linkProfile({
      client,
      strategy: "wallet",
      wallet: createWallet(walletId),
      chain: chain,
    });
  };

  return (
    <WalletProvider id={walletId}>
      <TouchableOpacity
        className="w-full flex-row items-center justify-start py-4 px-6 bg-backgroundSecondary rounded-lg gap-4"
        onPress={linkWallet}
      >
        <WalletIcon width={42} height={42} style={{ borderRadius: 4 }} />
        <WalletName
          style={{ fontSize: 16, color: Colors.primary, fontWeight: 700 }}
        />
      </TouchableOpacity>
    </WalletProvider>
  );
}
