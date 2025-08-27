import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  searchMulti,
  getMovieProviders,
  discoverMovies,
  discoverTV,
} from "../utils/tmdbApi";
import MovieDetailModal from "../components/MovieDetailModal";
import Carousel from "../components/Carousel";

const Home = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [featured, setFeatured] = useState([]);

  // 🔹 Autocompletado
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchMulti(search);
        setSuggestions(results.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  // 🔹 Cargar películas y series populares 2025 para carrusel
  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const moviesRes = await discoverMovies(2025);
        const tvRes = await discoverTV(2025);

        const combined = [...moviesRes, ...tvRes].slice(0, 15);

        const withProviders = await Promise.all(
          combined.map(async (item) => {
            const media_type = item.title ? "movie" : "tv";
            const providers = await getMovieProviders(item.id, media_type);
            return { ...item, media_type, providers };
          })
        );

        setFeatured(withProviders);
      } catch (err) {
        console.error("Error cargando destacados:", err);
      }
    };

    loadFeatured();
  }, []);

  const handleSearch = async (query = search) => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const results = await searchMulti(query);

      const resultsWithProviders = await Promise.all(
        results.map(async (item) => {
          const media_type = item.media_type;
          const providers = await getMovieProviders(item.id, media_type);
          return { ...item, providers };
        })
      );

      setMovies(resultsWithProviders);
      setSuggestions([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-6 sm:py-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6 sm:mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-yellow-400">
          🎬 Movie & Series Explorer
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base">
          Busca tus películas y series favoritas y descubre dónde verlas en streaming.
        </p>
      </motion.div>

      {/* Carrusel de destacados */}
      {featured.length > 0 && (
        <Carousel items={featured} onSelect={(item) => setSelectedMovie(item)} />
      )}

      {/* Buscador */}
      <div className="relative mt-4 sm:mt-6 flex justify-center w-full max-w-md mx-auto">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ej: Matrix, Stranger Things..."
          className="border-2 border-yellow-400 px-3 py-2 w-full rounded-l-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:text-white text-sm sm:text-base bg-gray-900 placeholder-gray-400"
        />
        <button
          onClick={() => handleSearch()}
          className="bg-yellow-400 text-gray-900 px-3 py-2 rounded-r-xl hover:bg-yellow-500 transition text-sm sm:text-base font-semibold"
        >
          Buscar
        </button>

        {/* Autocompletado */}
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-gray-800 border border-yellow-400 rounded-b-xl shadow-lg z-50 text-sm sm:text-base">
            {suggestions.map((s) => (
              <li
                key={s.id}
                onClick={() => handleSearch(s.title || s.name)}
                className="px-3 py-2 cursor-pointer hover:bg-yellow-400 hover:text-gray-900 transition"
              >
                {s.title || s.name} (
                {s.release_date?.slice(0, 4) ||
                  s.first_air_date?.slice(0, 4) ||
                  "N/A"}
                )
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Resultados */}
      {loading ? (
        <p className="text-center text-gray-300 mt-4">Cargando resultados...</p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-4"
        >
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              whileHover={{ scale: 1.03 }}
              className="cursor-pointer bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition"
              onClick={() => setSelectedMovie(movie)}
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={movie.title || movie.name}
                className="w-full h-60 sm:h-72 md:h-80 object-cover"
              />
              <div className="p-2 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-yellow-400 truncate">
                    {movie.title || movie.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mb-1">
                    {movie.release_date?.slice(0, 4) ||
                      movie.first_air_date?.slice(0, 4) ||
                      "N/A"}
                  </p>
                </div>

                {/* Providers scroll horizontal */}
                {movie.providers.length > 0 ? (
                  <div className="flex overflow-x-auto gap-2 mt-1 py-1 px-1">
                    {movie.providers.map((p) => (
                      <a
                        key={p.provider_id}
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={p.provider_name}
                        className="flex-shrink-0"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                          alt={p.provider_name}
                          className="w-6 h-6 rounded"
                        />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">No disponible en streaming</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default Home;
