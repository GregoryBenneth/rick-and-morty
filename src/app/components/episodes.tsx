"use client";

import { useState, useEffect } from "react";

interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
}

export default function EpisodeList() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState("");
  const [episodeFilter, setEpisodeFilter] = useState("");

  useEffect(() => {
    fetchEpisodes();
  }, [page]);

  useEffect(() => {
    filterEpisodes();
  }, [episodes, nameFilter, episodeFilter]);

  const fetchEpisodes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/episode?page=${page}`
      );
      const data = await response.json();
      setEpisodes(data.results);
    } catch (error) {
      console.error("Error fetching episodes:", error);
    }
    setLoading(false);
  };

  const filterEpisodes = () => {
    let filtered = episodes;
    if (nameFilter) {
      filtered = filtered.filter((ep) =>
        ep.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (episodeFilter) {
      filtered = filtered.filter((ep) =>
        ep.episode.toLowerCase().includes(episodeFilter.toLowerCase())
      );
    }
    setFilteredEpisodes(filtered);
  };

  return (
    <section className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-400">Episodes</h2>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="Filter by episode code (e.g. S01E01)"
          value={episodeFilter}
          onChange={(e) => setEpisodeFilter(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        />
      </div>
      {loading ? (
        <p className="text-center">Loading episodes...</p>
      ) : (
        <>
          <div className="grid gap-4">
            {filteredEpisodes.map((episode) => (
              <div key={episode.id} className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">{episode.name}</h3>
                <p className="text-sm text-gray-300">
                  Episode: {episode.episode}
                </p>
                <p className="text-sm text-gray-300">
                  Air Date: {episode.air_date}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="bg-green-500 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="bg-green-500 px-4 py-2 rounded-lg"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
