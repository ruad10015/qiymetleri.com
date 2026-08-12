import { ScreenPlaceholder } from "@/components/screen-placeholder";
import { useLocale } from "@/i18n/locale-context";

export function ContentScreen({ slug }: { slug?: string }) {
  const { t } = useLocale();
  return (
    <ScreenPlaceholder
      title={slug ?? t("footer.information")}
      body={t("content.ctaBody")}
    />
  );
}
