import "../global.css";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { Colors } from "@/constants/colors";
import { client, inApp } from "@/constants/thirdweb";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { remapProps } from "nativewind";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AccountAddress,
  ThirdwebProvider,
  useAutoConnect,
  useConnect,
} from "thirdweb/react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <View className="flex-1">
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider>
          <InnerApp />
        </ThirdwebProvider>
      </QueryClientProvider>
    </View>
  );
}

function InnerApp() {
  const router = useRouter();
  const autoConnecQuery = useAutoConnect({
    client,
    wallets: [inApp],
  });
  const connectMutation = useConnect();
  useEffect(() => {
    if (autoConnecQuery.data || autoConnecQuery.isLoading) {
      return;
    }
    // if not autoconnected, login as guest
    // TODO get last auth method instead?
    connectMutation.connect(async () => {
      await inApp.connect({
        strategy: "guest",
        client,
      });
      return inApp;
    });
  }, [autoConnecQuery.data, autoConnecQuery.isLoading]);

  if (connectMutation.isConnecting || autoConnecQuery.isLoading) {
    return (
      <>
        <SafeAreaView className="flex-1 items-center justify-center bg-background">
          <ActivityIndicator size="large" color={Colors.accent} />
        </SafeAreaView>
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="link-profile"
          options={{
            presentation: "modal",
            headerTitle: "Link Profile",
            headerTitleStyle: { color: Colors.primary },
            headerStyle: { backgroundColor: Colors.backgroundSecondary },
            headerTintColor: Colors.primary,
          }}
        />
        <Stack.Screen
          name="deposit"
          options={{
            presentation: "modal",
            headerTitle: "Deposit",
            headerTitleStyle: { color: Colors.primary },
            headerStyle: { backgroundColor: Colors.backgroundSecondary },
            headerTintColor: Colors.primary,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
