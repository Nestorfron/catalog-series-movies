import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Carousel = ({ items, onSelect }) => {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative py-4">
      {/* Flecha izquierda */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Contenedor scroll */}
      <div
        ref={containerRef}
        className="overflow-x-auto flex gap-4 px-4 scroll-smooth snap-x snap-mandatory"
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="min-w-[140px] sm:min-w-[180px] md:min-w-[220px] cursor-pointer flex-shrink-0 snap-start"
            whileHover={{ scale: 1.05 }}
            onClick={() => onSelect(item)}
          >
            <img
              src={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={item.title || item.name}
              className="rounded-lg w-full h-72 sm:h-80 md:h-96 object-cover shadow-md"
            />
            <p className="text-xs sm:text-sm mt-2 text-center truncate">
              {item.title || item.name}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Flecha derecha */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default Carousel;
