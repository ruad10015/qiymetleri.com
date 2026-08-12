import {
  getDemoCatalogueData,
  getDemoHomeData,
  getDemoProductPageData,
} from "@/api/demo-catalogue";

test("demo home exposes products, categories and stores", () => {
  const home = getDemoHomeData();

  expect(home.products).toHaveLength(8);
  expect(home.categories.find((item) => item.id === "smartphones")?.count).toBe(3);
  expect(home.stores.map((store) => store.id)).toEqual(expect.arrayContaining([
    "kontakt_home",
    "baku_electronics",
    "irshad_electronics",
    "ispace",
  ]));
});

test("demo catalogue supports search, filters and price sorting", () => {
  const catalogue = getDemoCatalogueData({
    q: "apple",
    category: "smartphones",
    sort_by: "price_asc",
    page: 1,
  });

  expect(catalogue.total).toBe(1);
  expect(catalogue.items[0]).toMatchObject({
    id: "apple_iphone_15_128gb_black",
    lowest_price: 1799,
  });
});

test("demo product detail includes offers and price history", () => {
  const page = getDemoProductPageData("apple_iphone_15_128gb_black");

  expect(page?.product.current_prices).toHaveLength(4);
  expect(page?.history).toHaveLength(12);
  expect(page?.stores).toHaveLength(4);
});

test("unknown demo product does not mask a real not-found response", () => {
  expect(getDemoProductPageData("missing-product")).toBeNull();
});
