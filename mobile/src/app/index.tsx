import { Stack } from "expo-router/stack";

import { HomeScreen } from "@/screens/home";

export default function HomeRoute() {
  return (
    <>
      <Stack.Title>qiymetleri.com</Stack.Title>
      <HomeScreen />
    </>
  );
}
