export const get = <TData = unknown>(path: string, query?: QueryParams) =>
  request<TData>("GET", path, undefined, query);
export const post = <TData = unknown>(path: string, data?: unknown) =>
  request<TData>("POST", path, data);
export const patch = <TData = unknown>(path: string, data?: unknown) =>
  request<TData>("PATCH", path, data);
export const del = <TData = unknown>(path: string) =>
  request<TData>("DELETE", path);

type QueryParams = Record<string, string | number | boolean | null | undefined>;

async function request<TData>(
  method: string,
  path: string,
  data?: unknown,
  query?: QueryParams
): Promise<TData> {
  const url = new URL(path, window.location.origin);
  if (query)
    for (const key in query) {
      const value = query[key];
      if (value != null && value !== "")
        url.searchParams.set(key, value.toString());
    }

  const headers: HeadersInit = {};
  if (data) headers["content-type"] = "application/json";

  const response = await fetch(url, {
    method,
    body: data ? JSON.stringify(data) : undefined,
    headers
  });
  const text = await response.text();

  let body: { data?: unknown; error?: { code?: string; details?: unknown } };
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    throw new ApiError(
      response.status,
      "PARSE_ERROR",
      "Invalid response from server"
    );
  }

  if (!response.ok)
    throw new ApiError(
      response.status,
      body.error?.code ?? "UNKNOWN_ERROR",
      body.error?.details ?? null
    );

  return body.data as TData;
}

export class ApiError<TDetails = unknown> extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    public readonly details: TDetails
  ) {
    super(code);
  }
}
