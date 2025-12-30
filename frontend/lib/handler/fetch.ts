import { RequestError } from "../http-error";
import logger from "../logger";
import handleError from "./error";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {}
): Promise<ActionResponse<T>> {
  const {
    timeout = 10000, // ปรับลดลงตามความเหมาะสม (เช่น 10 วินาที)
    headers: customHeaders = {},
    ...restOptions
  } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...customHeaders,
  };

  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
    credentials: "include",
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(id);

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        result?.error?.message || `HTTP error: ${response.status}`;
      throw new RequestError(response.status, errorMessage);
    }

    return result as ActionResponse<T>;
  } catch (err) {
    clearTimeout(id);
    const error = isError(err) ? err : new Error("Unknown error");

    if (error.name === "AbortError") {
      logger.warn(`Request Timeout ${url}`);
      return {
        success: false,
        error: { message: "การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง" },
      } as ActionResponse<T>;
    }

    logger.error(`Error fetching ${url}: ${error.message}`);

    return handleError(error) as ActionResponse<T>;
  }
}
