import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, useRouter } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import {
  AccountAddress,
  AccountAvatar,
  AccountBalance,
  AccountBlobbie,
  AccountProvider,
  SocialIcon,
  useActiveAccount,
  useProfiles,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { Colors } from "../../constants/colors";
import { chain, client } from "../../constants/thirdweb";

export function Profile() {
  const router = useRouter();
  const account = useActiveAccount();
  const profilesQuery = useProfiles({
    client,
  });
  const linkedProfiles = profilesQuery.data?.filter(
    (profile) => profile.type !== "guest",
  );
  const hasLinkedProfiles = linkedProfiles && linkedProfiles.length > 0;
  const linkedEmail = linkedProfiles?.find(
    (profile) => profile.details.email !== undefined,
  )?.details.email;

  if (!account) {
    return (
      <View className="flex-col items-center justify-center">
        <Text className="text-primary">No account connected</Text>
      </View>
    );
  }

  if (profilesQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <AccountProvider address={account.address} client={client}>
      <View className="flex-col items-center justify-center py-12 gap-y-8">
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
          <Text className="text-2xl text-primary font-bold mt-4">
            {linkedEmail?.split("@")[0] ||
              `user#${account.address.slice(2, 4)}${account.address.slice(-2)}`.toLowerCase()}
          </Text>
          <AccountAddress
            style={{ fontSize: 16, color: Colors.secondary }}
            formatFn={shortenAddress}
          />
        </View>
        <View className="flex-col items-center justify-center">
          <Text className="text-lg text-secondary">Account Balance</Text>
          <AccountBalance
            showBalanceInFiat={"USD"}
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
              fontSize: 48,
              fontWeight: "bold",
            }}
          />
        </View>
        <View className="w-full flex-row items-center justify-center px-6 gap-6">
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-32 flex-col items-center justify-center gap-2 bg-backgroundSecondary rounded-lg p-4"
            onPress={() => {
              router.push("/deposit");
            }}
          >
            <FontAwesome5
              name="angle-double-down"
              size={24}
              color={Colors.accent}
            />
            <Text className="text-primary font-bold text-lg">Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-32 flex-col items-center justify-center gap-2 bg-backgroundSecondary rounded-lg p-4"
          >
            <FontAwesome5
              name="angle-double-up"
              size={24}
              color={Colors.accent}
            />
            <Text className="text-primary font-bold text-lg">Withdraw</Text>
          </TouchableOpacity>
        </View>
        <View className="w-full h-[1px] bg-border" />
        <View className="w-full flex-col items-start justify-start px-6 gap-2">
          <Text className="text-lg text-primary font-bold">
            Linked Accounts
          </Text>
          <View className="w-full flex-col items-start justify-start gap-4">
            {profilesQuery.isLoading && (
              <Text className="text-primary">Loading...</Text>
            )}
            {linkedProfiles?.map((profile) => (
              <View
                key={profile.details.id}
                className="w-full flex-row items-center justify-start gap-4 bg-backgroundSecondary rounded-lg p-4"
              >
                <SocialIcon provider={profile.type} width={42} height={42} />
                <View className="flex-1 flex-col">
                  <Text className="text-primary font-bold text-lg">
                    {profile.type.charAt(0).toUpperCase() +
                      profile.type.slice(1)}
                  </Text>
                  <Text className="text-secondary">
                    {profile.details.email}
                  </Text>
                </View>
              </View>
            ))}
            <Link href="/link-profile" asChild>
              <TouchableOpacity className="w-full flex-row items-center justify-start py-4 px-6 bg-backgroundSecondary rounded-lg gap-4">
                <Ionicons name="person" size={32} color={Colors.accent} />
                <View className="flex-1 flex-col items-start justify-start">
                  <Text className="text-primary font-bold text-lg">
                    Link an account
                  </Text>
                  {!hasLinkedProfiles && (
                    <Text className="text-red-500 ">
                      Link an account to recover access if you loose your
                      device.
                    </Text>
                  )}
                  {hasLinkedProfiles && (
                    <Text className="text-secondary ">
                      Link another account to your profile.
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </AccountProvider>
  );
}
