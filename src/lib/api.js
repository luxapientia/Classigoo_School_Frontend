const API_URL = process.env.BACKEND_API_URL;

export async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
    throw new Error("Unauthorized");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  get: (endpoint) => fetchWithAuth(endpoint),
  post: (endpoint, body) =>
    fetchWithAuth(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (endpoint, body) =>
    fetchWithAuth(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (endpoint) =>
    fetchWithAuth(endpoint, {
      method: "DELETE",
    }),
}; 