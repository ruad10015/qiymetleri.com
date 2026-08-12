import { fetch } from "expo/fetch";

import { ResourceNotFoundError, apiGet, buildQuery } from "@/api/client";

jest.mock("expo/fetch", () => ({ fetch: jest.fn() }));

const mockedFetch = jest.mocked(fetch);
type FetchResponse = Awaited<ReturnType<typeof fetch>>;

function mockResponse(value: Partial<FetchResponse>): FetchResponse {
  return value as FetchResponse;
}

beforeEach(() => mockedFetch.mockReset());

test("buildQuery omits empty values and preserves catalogue values", () => {
  expect(buildQuery({ q: "iphone", page: 2, brand: undefined, category: "" })).toBe(
    "q=iphone&page=2",
  );
});

test("apiGet returns parsed JSON", async () => {
  mockedFetch.mockResolvedValue(mockResponse({
    ok: true,
    status: 200,
    json: async () => ({ total: 3 }),
  }));

  await expect(apiGet<{ total: number }>("/api/v1/products")).resolves.toEqual({ total: 3 });
});

test("apiGet maps missing resources to ResourceNotFoundError", async () => {
  mockedFetch.mockResolvedValue(mockResponse({ ok: false, status: 404 }));
  await expect(apiGet("/api/v1/products/missing")).rejects.toBeInstanceOf(
    ResourceNotFoundError,
  );
});

test("apiGet maps transport failures to a typed network error", async () => {
  mockedFetch.mockRejectedValue(new TypeError("offline"));
  await expect(apiGet("/api/v1/products")).rejects.toMatchObject({
    code: "NETWORK_ERROR",
    status: 0,
  });
});
