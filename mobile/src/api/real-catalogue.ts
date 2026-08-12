import snapshotJson from "@/data/real-catalogue.json";

import type {
  CatalogueData,
  CatalogueQuery,
  CurrentPrice,
  FilterOption,
  FiltersResponse,
  HomeData,
  ProductDetail,
  ProductPageData,
  ProductSummary,
  ProductVariant,
} from "@/api/types";

type RealProduct = {
  id: string;
  canonical_id: string;
  brand: string | null;
  category: string;
  model_family: string | null;
  name: string;
  image_url: string;
  attributes: Record<string, string | number>;
  offers: CurrentPrice[];
};

type RealCatalogueSnapshot = {
  generated_at: string;
  sources: { id: string; name: string }[];
  products: RealProduct[];
};

export const realCatalogue = snapshotJson as RealCatalogueSnapshot;

function optionCounts(
  values: string[],
  label: (value: string) => string = (value) => value,
): FilterOption[] {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts]
    .map(([id, count]) => ({ id, name: label(id), count }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function summary(product: RealProduct): ProductSummary {
  const inStockPrices = product.offers
    .filter((offer) => offer.in_stock)
    .map((offer) => offer.price_azn);
  return {
    id: product.id,
    canonical_id: product.canonical_id,
    brand: product.brand,
    category: product.category,
    model_family: product.model_family,
    name: product.name,
    image_url: product.image_url,
    lowest_price: inStockPrices.length ? Math.min(...inStockPrices) : null,
    store_count: new Set(product.offers.map((offer) => offer.store_id)).size,
    variant_count: variantsFor(product).length,
  };
}

function matchingProducts(query: CatalogueQuery): RealProduct[] {
  const search = query.q?.trim().toLocaleLowerCase("az") ?? "";
  return realCatalogue.products.filter((product) => {
    const searchable = `${product.name} ${product.brand ?? ""} ${product.model_family ?? ""}`
      .toLocaleLowerCase("az");
    return (!search || searchable.includes(search))
      && (!query.category || product.category === query.category)
      && (!query.brand || product.brand === query.brand)
      && (!query.store_id || product.offers.some((offer) => offer.store_id === query.store_id));
  });
}

function filtersFor(items: readonly RealProduct[]): FiltersResponse {
  const offers = items.flatMap((product) => product.offers);
  const prices = offers.filter((offer) => offer.in_stock).map((offer) => offer.price_azn);
  return {
    categories: optionCounts(items.map((product) => product.category)),
    brands: optionCounts(items.flatMap((product) => product.brand ? [product.brand] : []), (brand) =>
      brand.charAt(0).toLocaleUpperCase("az") + brand.slice(1)),
    stores: optionCounts(offers.map((offer) => offer.store_id), (storeId) =>
      realCatalogue.sources.find((store) => store.id === storeId)?.name ?? storeId),
    price_range: {
      min: prices.length ? Math.min(...prices) : null,
      max: prices.length ? Math.max(...prices) : null,
    },
  };
}

function interleaveCategories(products: ProductSummary[]): ProductSummary[] {
  const groups = new Map<string, ProductSummary[]>();
  for (const product of products) {
    const category = product.category ?? "other";
    groups.set(category, [...(groups.get(category) ?? []), product]);
  }
  const result: ProductSummary[] = [];
  const queues = [...groups.values()];
  while (queues.some((queue) => queue.length)) {
    for (const queue of queues) {
      const product = queue.shift();
      if (product) result.push(product);
    }
  }
  return result;
}

function variantsFor(product: RealProduct): RealProduct[] {
  if (!product.model_family) return [product];
  const family = product.model_family.toLocaleLowerCase("az");
  return realCatalogue.products.filter((candidate) =>
    candidate.brand === product.brand
      && candidate.category === product.category
      && candidate.model_family?.toLocaleLowerCase("az") === family,
  );
}

function productVariant(product: RealProduct): ProductVariant {
  return {
    id: product.id,
    name: product.name,
    storage_gb: typeof product.attributes.storage_gb === "number"
      ? product.attributes.storage_gb
      : null,
    color: typeof product.attributes.color === "string" ? product.attributes.color : null,
    current_prices: product.offers,
  };
}

export function getRealHomeData(): HomeData {
  const products = interleaveCategories(
    realCatalogue.products
      .map(summary)
      .sort((left, right) =>
        right.store_count - left.store_count
          || right.variant_count - left.variant_count
          || (left.lowest_price ?? Infinity) - (right.lowest_price ?? Infinity)),
  ).slice(0, 8);
  const filters = filtersFor(realCatalogue.products);
  return { products, categories: filters.categories, stores: filters.stores };
}

export function getRealCatalogueData(query: CatalogueQuery): CatalogueData {
  const page = Math.max(1, query.page ?? 1);
  const perPage = 20;
  const matching = matchingProducts(query);
  const items = matching.map(summary).sort((left, right) => {
    if (query.sort_by === "price_asc") {
      return (left.lowest_price ?? Infinity) - (right.lowest_price ?? Infinity);
    }
    if (query.sort_by === "price_desc") {
      return (right.lowest_price ?? -Infinity) - (left.lowest_price ?? -Infinity);
    }
    if (query.sort_by === "popular") {
      return right.store_count - left.store_count || right.variant_count - left.variant_count;
    }
    return left.name.localeCompare(right.name);
  });
  const start = (page - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    total: items.length,
    page,
    per_page: perPage,
    pages: Math.max(1, Math.ceil(items.length / perPage)),
    filters: filtersFor(matching),
  };
}

export function getRealProductPageData(productId: string): ProductPageData | null {
  const source = realCatalogue.products.find((product) => product.id === productId);
  if (!source) return null;
  const product: ProductDetail = {
    id: source.id,
    canonical_id: source.canonical_id,
    brand: source.brand,
    category: source.category,
    model_family: source.model_family,
    name: source.name,
    image_url: source.image_url,
    attributes: source.attributes,
    current_prices: source.offers,
    variants: variantsFor(source).map(productVariant),
    created_at: realCatalogue.generated_at,
    updated_at: realCatalogue.generated_at,
  };
  return { product, history: [], stores: filtersFor(realCatalogue.products).stores };
}
