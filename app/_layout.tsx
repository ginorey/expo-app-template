import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { chain, client, inApp } from "@/constants/thirdweb";
import { SafeAreaView, Text, View } from "react-native";
import {
  AutoConnect,
  ThirdwebProvider,
  useAutoConnect,
  useConnect,
} from "thirdweb/react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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
      <ThirdwebProvider>
        <InnerApp />
      </ThirdwebProvider>
    </View>
  );
}

function InnerApp() {
  const autoConnecQuery = useAutoConnect({
    client,
    wallets: [inApp],
  });
  const connectMutation = useConnect();
  useEffect(() => {
    console.log("autoConnecQuery", autoConnecQuery.data);
    if (autoConnecQuery.data || autoConnecQuery.isLoading) {
      return;
    }
    console.log("not autoconnected, login as guest");
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
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text className="text-2xl font-bold text-primary">Login in....</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
