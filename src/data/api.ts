export function api(path: string, method: string, body?: any) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiPrefix = "/1";
  const url = new URL(apiPrefix.concat(path), baseURL);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  const params = {
    headers,
    method,
    body: body ? JSON.stringify(body) : null,
  };
  return fetch(url, params);
}
