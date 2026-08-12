import { apiGet, buildQuery } from "@/api/client";
import type {
  CatalogueData,
  CatalogueQuery,
  FiltersResponse,
  HomeData,
  PriceHistoryPoint,
  ProductDetail,
  ProductPageData,
  ProductsResponse,
} from "@/api/types";

export async function getHomeData(signal?: AbortSignal): Promise<HomeData> {
  const [products, filters] = await Promise.all([
    apiGet<ProductsResponse>("/api/v1/products?per_page=8&sort_by=popular", signal),
    apiGet<FiltersResponse>("/api/v1/filters", signal),
  ]);

  return {
    products: products.items,
    categories: filters.categories,
    stores: filters.stores,
  };
}

export async function getCatalogueData(
  query: CatalogueQuery,
  signal?: AbortSignal,
): Promise<CatalogueData> {
  const productsQuery = buildQuery({ ...query, per_page: 20 });
  const filtersQuery = buildQuery({
    q: query.q,
    category: query.category,
    brand: query.brand,
    store_id: query.store_id,
  });
  const [products, filters] = await Promise.all([
    apiGet<ProductsResponse>(`/api/v1/products?${productsQuery}`, signal),
    apiGet<FiltersResponse>(`/api/v1/filters?${filtersQuery}`, signal),
  ]);
  return { ...products, filters };
}

export async function getProductPageData(
  productId: string,
  signal?: AbortSignal,
): Promise<ProductPageData> {
  const encodedId = encodeURIComponent(productId);
  const product = await apiGet<ProductDetail>(`/api/v1/products/${encodedId}`, signal);
  const [historyResult, filtersResult] = await Promise.allSettled([
    apiGet<PriceHistoryPoint[]>(`/api/v1/products/${encodedId}/history?days=30`, signal),
    apiGet<FiltersResponse>("/api/v1/filters", signal),
  ]);

  return {
    product,
    history: historyResult.status === "fulfilled" ? historyResult.value : [],
    stores: filtersResult.status === "fulfilled" ? filtersResult.value.stores : [],
  };
}
