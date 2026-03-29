/**
 * Marketplace products API (Vite dev server proxies /api → backend :5000).
 */
function apiBase() {
  const env = import.meta.env.VITE_API_URL;
  if (env) return env.replace(/\/$/, "");
  return "";
}

/**
 * @param {string | null} category - "Fashion" etc., or null / "All" for all products
 * @param {string | null} search - Search query string
 * @returns {Promise<{ products: Array, count: number }>}
 */
export async function fetchMarketplaceProducts(category, search) {
  const params = new URLSearchParams();
  if (category && category !== "All") {
    params.set("category", category);
  }
  if (search && search.trim() !== "") {
    params.set("search", search.trim());
  }
  const qs = params.toString();
  const url = `${apiBase()}/api/products${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to load products (${res.status})`);
  }

  return res.json();
}

/**
 * @param {string} categoryName
 * @param {object} filters { sort, rating }
 */
export async function fetchProductsByByCategoryName(categoryName, filters = {}) {
  const params = new URLSearchParams();
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.rating) params.set("rating", filters.rating);
  const qs = params.toString();
  
  const url = `${apiBase()}/api/products/category/${categoryName}${qs ? `?${qs}` : ""}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to load category products (${res.status})`);
  }

  return res.json();
}
