"use client";

import { useState, useEffect } from "react";

interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
}

export default function LocationList() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dimensionFilter, setDimensionFilter] = useState("");

  useEffect(() => {
    fetchLocations();
  }, [page]);

  useEffect(() => {
    filterLocations();
  }, [locations, nameFilter, typeFilter, dimensionFilter]);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/location?page=${page}`
      );
      const data = await response.json();
      setLocations(data.results);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
    setLoading(false);
  };

  const filterLocations = () => {
    let filtered = locations;
    if (nameFilter) {
      filtered = filtered.filter((loc) =>
        loc.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (typeFilter) {
      filtered = filtered.filter((loc) =>
        loc.type.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }
    if (dimensionFilter) {
      filtered = filtered.filter((loc) =>
        loc.dimension.toLowerCase().includes(dimensionFilter.toLowerCase())
      );
    }
    setFilteredLocations(filtered);
  };

  return (
    <section className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-400">Locations</h2>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="Filter by type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="Filter by dimension"
          value={dimensionFilter}
          onChange={(e) => setDimensionFilter(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        />
      </div>
      {loading ? (
        <p className="text-center">Loading locations...</p>
      ) : (
        <>
          <div className="grid gap-4">
            {filteredLocations.map((location) => (
              <div key={location.id} className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">{location.name}</h3>
                <p className="text-sm text-gray-300">Type: {location.type}</p>
                <p className="text-sm text-gray-300">
                  Dimension: {location.dimension}
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
