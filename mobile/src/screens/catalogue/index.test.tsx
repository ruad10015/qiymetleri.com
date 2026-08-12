import { render, screen } from "@testing-library/react-native";

import { LocaleProvider } from "@/i18n/locale-context";
import az from "@/i18n/messages/az.json";
import { CatalogueScreen } from "@/screens/catalogue";

jest.mock("@/api/queries", () => ({
  useCatalogueQuery: () => ({
    data: {
      items: [],
      total: 0,
      page: 1,
      per_page: 20,
      pages: 0,
      filters: { categories: [], brands: [], stores: [] },
    },
    error: null,
    isFetching: false,
    isPending: false,
    isRefetching: false,
    refetch: jest.fn(),
  }),
}));
jest.mock("@react-native-community/netinfo", () => ({
  useNetInfo: () => ({ isConnected: true }),
}));

jest.useFakeTimers();

test("exposes exactly the three sort modes from the public web catalogue", async () => {
  await render(
    <LocaleProvider>
      <CatalogueScreen query={{ sort_by: "name", page: 1 }} onUpdateQuery={jest.fn()} />
    </LocaleProvider>,
  );

  expect(screen.getByRole("button", { name: az.catalogue.sortName })).toBeOnTheScreen();
  expect(screen.getByRole("button", { name: az.catalogue.sortPriceAsc })).toBeOnTheScreen();
  expect(screen.getByRole("button", { name: az.catalogue.sortPriceDesc })).toBeOnTheScreen();
  expect(screen.queryByRole("button", { name: az.home.popularTitle })).not.toBeOnTheScreen();
});
