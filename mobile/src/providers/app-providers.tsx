import NetInfo from "@react-native-community/netinfo";
import { QueryClientProvider, onlineManager } from "@tanstack/react-query";
import { DefaultTheme, ThemeProvider } from "expo-router/react-navigation";
import type { PropsWithChildren } from "react";

import { queryClient } from "@/lib/query-client";
import { colors } from "@/theme/colors";

onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => setOnline(Boolean(state.isConnected))),
);

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    border: colors.border,
    card: colors.surface,
    primary: colors.accent,
    text: colors.text,
  },
};

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navigationTheme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}
