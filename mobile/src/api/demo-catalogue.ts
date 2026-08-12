import type {
  CatalogueData,
  CatalogueQuery,
  CurrentPrice,
  FilterOption,
  FiltersResponse,
  HomeData,
  PriceHistoryPoint,
  ProductDetail,
  ProductPageData,
  ProductSummary,
} from "@/api/types";

type DemoProductDefinition = {
  id: string;
  brand: string;
  category: string;
  modelFamily: string;
  name: string;
  attributes: Record<string, string | number>;
  prices: readonly (readonly [storeId: string, price: number])[];
};

const stores = [
  { id: "kontakt_home", name: "Kontakt Home" },
  { id: "baku_electronics", name: "Baku Electronics" },
  { id: "irshad_electronics", name: "İrşad" },
  { id: "ispace", name: "iSpace" },
] as const;

const products: readonly DemoProductDefinition[] = [
  {
    id: "apple_iphone_15_128gb_black",
    brand: "Apple",
    category: "smartphones",
    modelFamily: "iPhone 15",
    name: "Apple iPhone 15 128GB Black",
    attributes: { storage_gb: 128, color: "Black" },
    prices: [["kontakt_home", 1799], ["baku_electronics", 1829], ["irshad_electronics", 1849], ["ispace", 1899]],
  },
  {
    id: "samsung_galaxy_s24_256gb_gray",
    brand: "Samsung",
    category: "smartphones",
    modelFamily: "Galaxy S24",
    name: "Samsung Galaxy S24 256GB Gray",
    attributes: { storage_gb: 256, color: "Gray" },
    prices: [["kontakt_home", 1549], ["baku_electronics", 1579], ["irshad_electronics", 1599]],
  },
  {
    id: "apple_macbook_air_m3_256gb",
    brand: "Apple",
    category: "laptops",
    modelFamily: "MacBook Air M3",
    name: "Apple MacBook Air M3 13-inch 256GB",
    attributes: { storage_gb: 256, chip: "M3" },
    prices: [["kontakt_home", 2299], ["baku_electronics", 2349], ["ispace", 2399]],
  },
  {
    id: "samsung_crystal_uhd_55",
    brand: "Samsung",
    category: "televisions",
    modelFamily: "Crystal UHD 55",
    name: "Samsung 55-inch Crystal UHD 4K TV",
    attributes: { size_inch: 55 },
    prices: [["kontakt_home", 1099], ["baku_electronics", 1129], ["irshad_electronics", 1149]],
  },
  {
    id: "sony_wh_1000xm5_black",
    brand: "Sony",
    category: "headphones",
    modelFamily: "WH-1000XM5",
    name: "Sony WH-1000XM5 Black",
    attributes: { color: "Black" },
    prices: [["kontakt_home", 649], ["baku_electronics", 679], ["irshad_electronics", 699]],
  },
  {
    id: "apple_ipad_10_64gb",
    brand: "Apple",
    category: "tablets",
    modelFamily: "iPad 10",
    name: "Apple iPad 10.9-inch 64GB Wi-Fi",
    attributes: { storage_gb: 64 },
    prices: [["kontakt_home", 899], ["baku_electronics", 929], ["ispace", 949]],
  },
  {
    id: "apple_watch_series_9_41mm",
    brand: "Apple",
    category: "smartwatches",
    modelFamily: "Watch Series 9",
    name: "Apple Watch Series 9 41mm",
    attributes: { size_mm: 41 },
    prices: [["kontakt_home", 799], ["baku_electronics", 829], ["ispace", 849]],
  },
  {
    id: "xiaomi_redmi_note_13_pro_256gb",
    brand: "Xiaomi",
    category: "smartphones",
    modelFamily: "Redmi Note 13 Pro",
    name: "Xiaomi Redmi Note 13 Pro 256GB",
    attributes: { storage_gb: 256 },
    prices: [["kontakt_home", 569], ["baku_electronics", 589], ["irshad_electronics", 599]],
  },
] as const;

const demoTimestamp = new Date().toISOString();

function optionCounts(values: string[], label: (value: string) => string = (value) => value): FilterOption[] {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts].map(([id, count]) => ({ id, name: label(id), count }));
}

function currentPrices(product: DemoProductDefinition): CurrentPrice[] {
  return product.prices.map(([storeId, price]) => ({
    id: `${product.id}_${storeId}`,
    store_id: storeId,
    price_azn: price,
    original_title: product.name,
    url: null,
    in_stock: true,
    last_checked_at: demoTimestamp,
  }));
}

function summary(product: DemoProductDefinition): ProductSummary {
  return {
    id: product.id,
    canonical_id: product.id,
    brand: product.brand,
    category: product.category,
    model_family: product.modelFamily,
    name: product.name,
    image_url: null,
    lowest_price: Math.min(...product.prices.map(([, price]) => price)),
    store_count: product.prices.length,
    variant_count: 1,
  };
}

function matchingProducts(query: CatalogueQuery): DemoProductDefinition[] {
  const search = query.q?.trim().toLocaleLowerCase("az") ?? "";
  return products.filter((product) => {
    const searchable = `${product.name} ${product.brand} ${product.modelFamily}`.toLocaleLowerCase("az");
    return (!search || searchable.includes(search))
      && (!query.category || product.category === query.category)
      && (!query.brand || product.brand.toLocaleLowerCase("az") === query.brand.toLocaleLowerCase("az"))
      && (!query.store_id || product.prices.some(([storeId]) => storeId === query.store_id));
  });
}

function filtersFor(items: readonly DemoProductDefinition[]): FiltersResponse {
  const allPrices = items.flatMap((product) => product.prices.map(([, price]) => price));
  const activeStoreIds = items.flatMap((product) => product.prices.map(([storeId]) => storeId));
  return {
    categories: optionCounts(items.map((product) => product.category)),
    brands: optionCounts(items.map((product) => product.brand.toLocaleLowerCase("az")), (brand) => {
      const product = items.find((item) => item.brand.toLocaleLowerCase("az") === brand);
      return product?.brand ?? brand;
    }),
    stores: optionCounts(activeStoreIds, (storeId) => stores.find((store) => store.id === storeId)?.name ?? storeId),
    price_range: {
      min: allPrices.length ? Math.min(...allPrices) : null,
      max: allPrices.length ? Math.max(...allPrices) : null,
    },
  };
}

export function getDemoHomeData(): HomeData {
  const popular = [...products]
    .sort((left, right) => right.prices.length - left.prices.length)
    .map(summary);
  return { products: popular, categories: filtersFor(products).categories, stores: filtersFor(products).stores };
}

export function getDemoCatalogueData(query: CatalogueQuery): CatalogueData {
  const page = Math.max(1, query.page ?? 1);
  const perPage = 20;
  const matching = matchingProducts(query);
  const items = matching.map(summary).sort((left, right) => {
    if (query.sort_by === "price_asc") return (left.lowest_price ?? Infinity) - (right.lowest_price ?? Infinity);
    if (query.sort_by === "price_desc") return (right.lowest_price ?? -Infinity) - (left.lowest_price ?? -Infinity);
    if (query.sort_by === "popular") return right.store_count - left.store_count;
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

export function getDemoProductPageData(productId: string): ProductPageData | null {
  const definition = products.find((product) => product.id === productId);
  if (!definition) return null;
  const prices = currentPrices(definition);
  const product: ProductDetail = {
    ...summary(definition),
    attributes: definition.attributes,
    current_prices: prices,
    variants: prices.length ? [{
      id: definition.id,
      name: definition.name,
      storage_gb: typeof definition.attributes.storage_gb === "number" ? definition.attributes.storage_gb : null,
      color: typeof definition.attributes.color === "string" ? definition.attributes.color : null,
      current_prices: prices,
    }] : [],
    created_at: demoTimestamp,
    updated_at: demoTimestamp,
  };
  const history: PriceHistoryPoint[] = definition.prices.flatMap(([storeId, price]) =>
    ([[14, 1.08], [7, 1.04], [0, 1]] as const).map(([days, multiplier]) => {
      const time = new Date();
      time.setDate(time.getDate() - days);
      return {
        time: time.toISOString(),
        product_id: definition.id,
        store_id: storeId,
        price_azn: Math.round(price * multiplier * 100) / 100,
        in_stock: true,
      };
    }),
  );
  return { product, history, stores: filtersFor(products).stores };
}
