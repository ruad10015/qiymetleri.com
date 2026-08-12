import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { LanguageSwitch } from "@/components/language-switch";
import { useLocale } from "@/i18n/locale-context";
import { navigationCopy } from "@/i18n/navigation-copy";
import { colors } from "@/theme/colors";

const shopLinks = [
  ["smartphones", "categories.phones"],
  ["laptops", "categories.laptops"],
  ["televisions", "categories.tvs"],
] as const;

const informationLinks = [
  ["about", "footer.about"],
  ["partnership", "footer.partnership"],
  ["social", "footer.social"],
  ["contact", "footer.contact"],
] as const;

const legalLinks = [
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

      <LinkSection title={t("nav.login")}>
        <ContentLink slug="login" label={t("nav.login")} />
      </LinkSection>

      <LinkSection title={t("footer.shop")}>
        {shopLinks.map(([category, labelKey]) => (
          <Link key={category} href={{ pathname: "/products", params: { category } }} asChild>
            <LinkRow label={t(labelKey)} />
          </Link>
        ))}
      </LinkSection>

      <LinkSection title={t("footer.information")}>
        {informationLinks.map(([slug, labelKey]) => (
          <ContentLink key={slug} slug={slug} label={t(labelKey)} />
        ))}
      </LinkSection>

      <LinkSection title={t("footer.legal")}>
        {legalLinks.map(([slug, labelKey]) => (
          <ContentLink key={slug} slug={slug} label={t(labelKey)} />
        ))}
      </LinkSection>

      <View style={{ borderTopColor: colors.border, borderTopWidth: 1, gap: 6, paddingTop: 20 }}>
        <Text selectable style={{ color: colors.muted, fontFamily: "Manrope", fontSize: 12 }}>
          {t("footer.tagline")}
        </Text>
        <Text selectable style={{ color: colors.mutedLight, fontFamily: "Manrope", fontSize: 11 }}>
          {t("footer.copyright", { year: 2026 })}
        </Text>
      </View>
    </ScrollView>
  );
}

function LinkSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Text
        selectable
        role="heading"
        aria-level={2}
        style={{ color: colors.text, fontFamily: "LTSuperiorExtraBold", fontSize: 18 }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function ContentLink({ slug, label }: { slug: string; label: string }) {
  return (
    <Link href={{ pathname: "/[slug]", params: { slug } }} asChild>
      <LinkRow label={label} />
    </Link>
  );
}

function LinkRow({ label }: { label: string }) {
  return (
    <Pressable
      role="link"
      aria-label={label}
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
        {label}
      </Text>
      <Text aria-hidden style={{ color: colors.mutedLight, fontSize: 20 }}>
        ›
      </Text>
    </Pressable>
  );
}
