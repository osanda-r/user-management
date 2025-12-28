const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function request(path: string, opts: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, opts);
  let data: any = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) throw { status: res.status, data };
  return { data };
}

const api = {
  get: (path: string) => request(path, { method: "GET" }),
  post: (path: string, body?: any) =>
    request(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  put: (path: string, body?: any) =>
    request(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  delete: (path: string) => request(path, { method: "DELETE" }),
};

export default api;
