import { ScreenPlaceholder } from "@/components/screen-placeholder";
import { useLocale } from "@/i18n/locale-context";

export function ProductDetailScreen({ productId }: { productId?: string }) {
  const { t } = useLocale();
  return (
    <ScreenPlaceholder
      title={t("productPage.stores")}
      body={`${t("productPage.historyBody")} ${productId ?? ""}`.trim()}
    />
  );
}
