import { Image } from "expo-image";
import { ScrollView, Text, View } from "react-native";

import { colors } from "@/theme/colors";

export function HomeScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
    >
      <View style={{ alignItems: "center", gap: 16 }}>
        <Image
          source={require("@/assets/brand/logo.svg")}
          style={{ height: 88, width: 88 }}
          contentFit="contain"
        />
        <Text
          selectable
          role="heading"
          aria-level={1}
          style={{ color: colors.text, fontFamily: "LTSuperiorExtraBold", fontSize: 28 }}
        >
          qiymetleri.com
        </Text>
      </View>
    </ScrollView>
  );
}
