import { API_HOST } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

// IMPORTANTE: Todas as requisições passam pelo Nginx (porta 80)
// O Nginx faz o roteamento para os microserviços internos
const HOST = (API_HOST || "http://localhost").replace(/\/+$/g, "");
const API_BASE = `${HOST}`;

async function request(method, path, options = {}) {
  const pathname = path.startsWith("/") ? path : `/${path}`;
  const url = path.startsWith("http") ? path : `${API_BASE}${pathname}`;

  console.log(`[API] ${method} ${url}`);

  // Get token from AsyncStorage
  let token = null;
  try {
    token = await AsyncStorage.getItem("userToken");
  } catch (error) {
    console.warn("[API] Failed to get token from AsyncStorage:", error);
  }

  // Build headers with Authorization
  const headers = {
    ...(options.headers || {}),
  };

  // Add Authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const opts = {
    method,
    ...options,
    headers,
  };

  const res = await fetch(url, opts);

  console.log(`[API] Response status: ${res.status}`);

  // try to parse json when possible
  let json = null;
  try {
    json = await res.json();
    console.log(
      `[API] Response data:`,
      JSON.stringify(json, null, 2).substring(0, 500)
    );
  } catch (e) {
    // no json body
    console.log(`[API] No JSON body in response`);
  }

  if (!res.ok) {
    const err = new Error(json?.message || res.statusText || "API error");
    err.status = res.status;
    err.body = json;
    throw err;
  }

  // If response already has success/data structure, return as is
  // Otherwise, wrap it for compatibility
  if (json && typeof json === "object" && "success" in json) {
    return json;
  }

  return { success: true, data: json, status: res.status };
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
      body:
        body !== null && body !== undefined ? JSON.stringify(body) : undefined,
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
  patch: (path, body, opts = {}) => {
    const requestOpts = { ...opts };
    if (body !== null && body !== undefined) {
      requestOpts.body = JSON.stringify(body);
      requestOpts.headers = {
        ...opts?.headers,
        "Content-Type": "application/json",
      };
    }
    return request("PATCH", path, requestOpts);
  },
  // Método para enviar FormData (usado para upload de arquivos)
  postFormData: async (path, formData, opts = {}) => {
    const pathname = path.startsWith("/") ? path : `/${path}`;
    const url = path.startsWith("http") ? path : `${API_BASE}${pathname}`;

    // Get token from AsyncStorage
    let token = null;
    try {
      token = await AsyncStorage.getItem("userToken");
    } catch (error) {
      console.warn("[API] Failed to get token from AsyncStorage:", error);
    }

    const headers = {
      ...(opts.headers || {}),
    };

    // Add Authorization header if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // NÃO definir Content-Type - o fetch faz isso automaticamente para FormData
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
      ...opts,
    });

    console.log(`[API] Response status: ${res.status}`);

    let json = null;
    try {
      json = await res.json();
      console.log(
        `[API] Response data:`,
        JSON.stringify(json, null, 2).substring(0, 500)
      );
    } catch (e) {
      console.log(`[API] No JSON body in response`);
    }

    if (!res.ok) {
      const err = new Error(json?.message || res.statusText || "API error");
      err.status = res.status;
      err.body = json;
      throw err;
    }

    return json;
  },
  raw: (path, opts = {}) => {
    // for callers that want the raw fetch Response
    const pathname = path.startsWith("/") ? path : `/${path}`;
    const url = path.startsWith("http") ? path : `${API_BASE}${pathname}`;
    return fetch(url, opts);
  },
  API_BASE,
};

export default api;
