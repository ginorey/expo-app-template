import { Profile } from "@/components/profile/Profile";
import { SafeAreaView, Text } from "react-native";

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <Profile />
    </SafeAreaView>
  );
}
