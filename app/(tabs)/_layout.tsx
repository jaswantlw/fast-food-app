import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Slot } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabsLayout() {
    const isAuthenticated = false;

    if(!isAuthenticated){
        return <Redirect href={"/sign-in"}/>
    }
  return (
    <SafeAreaView>
          <Text>TabsLayout</Text>
          <Slot />
        </SafeAreaView>
  )
}