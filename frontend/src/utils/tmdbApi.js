const BASE_URL = import.meta.env.VITE_TMDB_API_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Función interna para hacer fetch a TMDb
const fetchTMDB = async (endpoint, params = {}) => {
  try {
    const url = new URL(`${BASE_URL}${endpoint}`);
    Object.entries({ api_key: API_KEY, ...params }).forEach(([key, value]) =>
      url.searchParams.append(key, value)
    );

    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GET ${url} → ${res.status} | Respuesta: ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Error en fetchTMDB:", err);
    return null;
  }
};

// 🔹 Buscar películas por nombre
export const searchMovies = async (query, page = 1) => {
  const data = await fetchTMDB("/search/movie", {
    query,
    page,
    language: "es-ES",
  });
  return data?.results || [];
};

// 🔹 Buscar movies y series (multi)
export const searchMulti = async (query, page = 1) => {
  const data = await fetchTMDB("/search/multi", {
    query,
    page,
    language: "es-ES",
  });
  // Filtramos solo movies y tv
  return data?.results.filter((r) => r.media_type === "movie" || r.media_type === "tv") || [];
};

// 🔹 Obtener detalles de película o serie
export const getMovieDetails = async (id, media_type = "movie") => {
  const endpoint = media_type === "movie" ? `/movie/${id}` : `/tv/${id}`;
  const data = await fetchTMDB(endpoint, { language: "es-ES" });
  return data || null;
};

// 🔹 Obtener proveedores de streaming
export const getMovieProviders = async (id, media_type = "movie", country = "UY") => {
  const endpoint = media_type === "movie" ? `/movie/${id}/watch/providers` : `/tv/${id}/watch/providers`;
  const data = await fetchTMDB(endpoint);
  const providers = data?.results?.[country]?.flatrate || [];

  // Agregamos URL de TMDb por defecto para cada provider
  return providers.map((p) => ({
    ...p,
    url: `https://www.themoviedb.org/${media_type}/${id}`,
  }));
};

// 🔹 Descubrir películas populares recientes
export const discoverMovies = async (year = 2025, page = 1) => {
  const data = await fetchTMDB("/discover/movie", {
    sort_by: "popularity.desc",
    primary_release_year: year,
    language: "es-ES",
    page,
  });
  return data?.results || [];
};

// 🔹 Descubrir series populares recientes
export const discoverTV = async (year = 2025, page = 1) => {
  const data = await fetchTMDB("/discover/tv", {
    sort_by: "popularity.desc",
    first_air_date_year: year,
    language: "es-ES",
    page,
  });
  return data?.results || [];
};
