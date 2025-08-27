import React from "react";

const MovieDetailModal = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>

        <div className="flex flex-col md:flex-row gap-4">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={movie.title}
            className="w-40 md:w-48 rounded"
          />

          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
              {movie.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {movie.release_date?.slice(0, 4) || "Sin fecha"} | ⭐{" "}
              {movie.vote_average || "N/A"}
            </p>
            <p className="text-gray-700 dark:text-gray-200 mb-4">
              {movie.overview}
            </p>

            {movie.providers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.providers.map((p) => (
                  <a
                    key={p.provider_id}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 border p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                      alt={p.provider_name}
                      className="w-6 h-6 rounded"
                    />
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {p.provider_name}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
