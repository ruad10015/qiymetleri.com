import { useLocale } from "@/i18n/locale-context";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export function CatalogueScreen() {
  const { t } = useLocale();
  return <ScreenPlaceholder title={t("catalogue.title")} body={t("home.emptyProducts")} />;
}
