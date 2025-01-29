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
import {
  authStrategies,
  chain,
  client,
  supportedWallets,
} from "../../constants/thirdweb";

export default function LinkProfile() {
  const {
    mutate: linkProfile,
    isPending: isLinkingProfile,
    error,
  } = useLinkProfile();

  const linkSocial = (strategy: InAppWalletSocialAuth) => {
    linkProfile({
      client,
      strategy,
    });
  };

  const linkWallet = (walletId: WalletId) => {
    linkProfile({
      client,
      strategy: "wallet",
      wallet: createWallet(walletId),
      chain: chain,
    });
  };

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
        {authStrategies.map((strategy) => (
          <SocialLinkButton
            strategy={strategy}
            onClick={linkSocial}
            key={strategy}
          />
        ))}
        {supportedWallets.map((walletId) => (
          <WalletLinkButton
            walletId={walletId}
            onClick={linkWallet}
            key={walletId}
          />
        ))}
      </View>
    </View>
  );
}

function SocialLinkButton({
  strategy,
  onClick,
}: {
  strategy: InAppWalletSocialAuth;
  onClick: (strategy: InAppWalletSocialAuth) => void;
}) {
  return (
    <TouchableOpacity
      className="w-full flex-row items-center justify-start py-4 px-6 bg-backgroundSecondary rounded-lg gap-4"
      onPress={() => onClick(strategy)}
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
  onClick,
}: {
  walletId: WalletId;
  onClick: (walletId: WalletId) => void;
}) {
  return (
    <WalletProvider id={walletId}>
      <TouchableOpacity
        className="w-full flex-row items-center justify-start py-4 px-6 bg-backgroundSecondary rounded-lg gap-4"
        onPress={() => onClick(walletId)}
      >
        <WalletIcon width={42} height={42} style={{ borderRadius: 4 }} />
        <WalletName
          style={{ fontSize: 16, color: Colors.primary, fontWeight: 700 }}
        />
      </TouchableOpacity>
    </WalletProvider>
  );
}
