import { useNetInfo } from "@react-native-community/netinfo";
import { Text } from "react-native";

import { useLocale } from "@/i18n/locale-context";

const copy = {
  az: "İnternet bağlantısı yoxdur. Keşdə olan məlumatlar göstərilir.",
  ru: "Нет подключения к интернету. Показаны сохранённые данные.",
} as const;

export function NetworkBanner() {
  const network = useNetInfo();
  const { locale } = useLocale();
  if (network.isConnected !== false) return null;
  return (
    <Text
      selectable
      role="alert"
      style={{
        backgroundColor: "#fff7ed",
        borderCurve: "continuous",
        borderRadius: 12,
        color: "#9a3412",
        fontFamily: "Manrope",
        fontSize: 12,
        lineHeight: 18,
        padding: 12,
      }}
    >
      {copy[locale]}
    </Text>
  );
}
