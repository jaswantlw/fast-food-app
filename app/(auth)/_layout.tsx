import { images } from "@/constants";
import useAuthStore from "@/store/auth.store";
import { logout } from "@/lib/appwrite";
import { Redirect, Slot } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Button,
} from "react-native";

export default function AuthLayout() {
  const { isAuthenticated, setIsAuthenticated, setUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isAuthenticated) return <Redirect href={"./"} />;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="bg-white h-full"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
      >
        {/* Top Section with graphics */}
        <View
          className="w-full relative"
          style={{ height: Dimensions.get("screen").height / 2.25 }}
        >
          <ImageBackground
            source={images.loginGraphic}
            className="size-full rounded-b-lg"
            resizeMode="stretch"
          />

          <Image
            source={images.logo}
            className="self-center size-48 absolute -bottom-16 z-10"
          />
        </View>

        {/* Middle Slot (auth screens go here) */}
        <Slot />

        {/* Bottom Logout Button */}
        <View className="p-4">
          <Button title="Logout" color="red" onPress={handleLogout} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
