import { useLocalSearchParams } from "expo-router";
import { Stack } from "expo-router/stack";

import { useLocale } from "@/i18n/locale-context";
import { navigationCopy } from "@/i18n/navigation-copy";
import { ContentScreen } from "@/screens/content";

export default function ContentRoute() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { locale } = useLocale();

  return (
    <>
      <Stack.Title>{navigationCopy[locale].information}</Stack.Title>
      <ContentScreen slug={slug} />
    </>
  );
}
