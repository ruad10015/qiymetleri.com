import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { LanguageSwitch } from "@/components/language-switch";
import { useLocale } from "@/i18n/locale-context";
import { navigationCopy } from "@/i18n/navigation-copy";
import { colors } from "@/theme/colors";

const links = [
  ["login", "nav.login"],
  ["about", "footer.about"],
  ["partnership", "footer.partnership"],
  ["social", "footer.social"],
  ["contact", "footer.contact"],
  ["terms", "footer.terms"],
  ["privacy", "footer.privacy"],
  ["personal-data", "footer.personalData"],
  ["consent", "footer.consent"],
] as const;

export function MoreScreen() {
  const { locale, t } = useLocale();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ gap: 20, padding: 16, paddingBottom: 32 }}
    >
      <View style={{ gap: 10 }}>
        <Text
          selectable
          role="heading"
          aria-level={2}
          style={{ color: colors.text, fontFamily: "LTSuperiorExtraBold", fontSize: 18 }}
        >
          {navigationCopy[locale].language}
        </Text>
        <LanguageSwitch />
      </View>

      <View style={{ gap: 8 }}>
        <Text
          selectable
          role="heading"
          aria-level={2}
          style={{ color: colors.text, fontFamily: "LTSuperiorExtraBold", fontSize: 18 }}
        >
          {t("footer.information")}
        </Text>
        {links.map(([slug, labelKey]) => (
          <Link
            key={slug}
            href={{ pathname: "/[slug]", params: { slug } }}
            asChild
          >
            <Pressable
              role="link"
              style={({ pressed }) => ({
                alignItems: "center",
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderCurve: "continuous",
                borderRadius: 14,
                borderWidth: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                minHeight: 52,
                opacity: pressed ? 0.7 : 1,
                paddingHorizontal: 16,
              })}
            >
              <Text style={{ color: colors.text, fontFamily: "Manrope", fontWeight: "700" }}>
                {t(labelKey)}
              </Text>
              <Text aria-hidden style={{ color: colors.mutedLight, fontSize: 20 }}>
                ›
              </Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}
