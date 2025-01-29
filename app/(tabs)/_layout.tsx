import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/colors";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tabIconSelected,
        tabBarInactiveTintColor: Colors.tabIconDefault,
        headerShown: true,
        headerTitleStyle: {
          color: Colors.primary,
        },
        headerStyle: {
          backgroundColor: Colors.backgroundSecondary,
        },
        tabBarButton: HapticTab,
        tabBarStyle: {
          minHeight: 52,
          borderColor: Colors.border,
          backgroundColor: Colors.background,
          paddingTop: Platform.OS === "ios" ? 10 : 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
