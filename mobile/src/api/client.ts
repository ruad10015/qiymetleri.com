import { fetch } from "expo/fetch";

const fallbackApiUrl = "http://10.0.2.2:8000";

export const apiBaseUrl = (process.env.EXPO_PUBLIC_API_URL || fallbackApiUrl).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: "HTTP_ERROR" | "NETWORK_ERROR" | "INVALID_RESPONSE",
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ResourceNotFoundError extends ApiError {
  constructor() {
    super("Resource not found", 404, "HTTP_ERROR");
    this.name = "ResourceNotFoundError";
  }
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      headers: { Accept: "application/json" },
      signal,
    });

    if (response.status === 404 || response.status === 422) {
      throw new ResourceNotFoundError();
    }
    if (!response.ok) {
      throw new ApiError(`HTTP ${response.status}`, response.status, "HTTP_ERROR");
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new ApiError("Invalid JSON response", response.status, "INVALID_RESPONSE");
    }
  } catch (error) {
    if (error instanceof ApiError || (error instanceof Error && error.name === "AbortError")) {
      throw error;
    }
    throw new ApiError("Network request failed", 0, "NETWORK_ERROR");
  }
}

export function buildQuery(
  values: Record<string, string | number | null | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  return params.toString();
}
