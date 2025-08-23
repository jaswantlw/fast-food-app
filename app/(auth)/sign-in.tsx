import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { signIn } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import { User } from "@/type";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignIn = () => {
  const { setIsAuthenticated, setUser } = useAuthStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async () => {
  const { email, password } = form;

  if (!email || !password) {
    return Alert.alert("Error", "Please enter credentials");
  }

  setIsSubmitting(true);

  try {
    const user = await signIn({ email, password });
    console.log("User from signIn:", user); // Debug log
    
    if (!user) {
      throw new Error("No user data received");
    }

    setUser(user);
    setIsAuthenticated(true);
    
    // Add delay to ensure state is updated
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log("Auth store state:", useAuthStore.getState()); // Debug log
    router.replace("/(tabs)");
  } catch (error: any) {
    console.error("Sign in error:", error); // Debug log
    Alert.alert("Error", error.message);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => {
          setForm((prev) => ({ ...prev, email: text }));
        }}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) => {
          setForm((prev) => ({ ...prev, password: text }));
        }}
        label="Password"
        secureTextEntry={true}
      />
      <CustomButton title="Sign In" isLoading={isSubmitting} onPress={submit} />

      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Don't have an account?
        </Text>
        <Link href={"/sign-up"} className="base-bold text-primary">
          Sign Up
        </Link>
      </View>
    </View>
  );
};

export default SignIn;
