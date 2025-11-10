import { API_HOST } from "@env";

const HOST = (API_HOST || "http://localhost:3001").replace(/\/+$/g, "");
const API_BASE = `${HOST}/api`;

async function request(method, path, options = {}) {
  const pathname = path.startsWith("/") ? path : `/${path}`;
  const url = path.startsWith("http") ? path : `${API_BASE}${pathname}`;

  const opts = { method, ...options };

  const res = await fetch(url, opts);
  // try to parse json when possible
  let json = null;
  try {
    json = await res.json();
  } catch (e) {
    // no json body
  }

  if (!res.ok) {
    const err = new Error(json?.message || res.statusText || "API error");
    err.status = res.status;
    err.body = json;
    throw err;
  }

  return json;
}

export const api = {
  get: (path, opts) => request("GET", path, opts),
  post: (path, body, opts = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    };
    return request("POST", path, {
      ...opts,
      headers,
      body: JSON.stringify(body),
    });
  },
  put: (path, body, opts = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    };
    return request("PUT", path, {
      ...opts,
      headers,
      body: JSON.stringify(body),
    });
  },
  delete: (path, opts = {}) => request("DELETE", path, opts),
  raw: (path, opts = {}) => {
    // for callers that want the raw fetch Response
    const pathname = path.startsWith("/") ? path : `/${path}`;
    const url = path.startsWith("http") ? path : `${API_BASE}${pathname}`;
    return fetch(url, opts);
  },
  API_BASE,
};

export default api;
