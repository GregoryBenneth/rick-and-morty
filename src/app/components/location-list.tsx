"use client";

import { useState, useEffect } from "react";
import Spinner from "./ui/spinner";

interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
}

export default function LocationList() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dimensionFilter, setDimensionFilter] = useState("");

  const itemsPerPage = 8; 

  useEffect(() => {
    fetchAllLocations();
  }, []);

  useEffect(() => {
    handleFilterLocations();
  }, [nameFilter, typeFilter, dimensionFilter, locations]);

  const fetchAllLocations = async () => {
    setLoading(true);
    let allLocations: Location[] = [];
    let nextPage = 1;

    try {
      while (nextPage) {
        const response = await fetch(
          `https://rickandmortyapi.com/api/location?page=${nextPage}`
        );
        const data = await response.json();

        if (data.results) {
          allLocations = [...allLocations, ...data.results];
        }

        nextPage = data.info?.next ? nextPage + 1 : 0; 
      }

      setLocations(allLocations);
      setFilteredLocations(allLocations); 
    } catch (error) {
      console.error("Error fetching locations:", error);
      setLocations([]);
      setFilteredLocations([]);
    }
    setLoading(false);
  };

  const handleFilterLocations = () => {
    if (!nameFilter && !typeFilter && !dimensionFilter) {
      setFilteredLocations(locations); 
      setCurrentPage(1); 
      return;
    }

    const filtered = locations.filter((location) => {
      const matchesName = nameFilter
        ? location.name.toLowerCase().includes(nameFilter.toLowerCase())
        : true;
      const matchesType = typeFilter
        ? location.type.toLowerCase().includes(typeFilter.toLowerCase())
        : true;
      const matchesDimension = dimensionFilter
        ? location.dimension
            .toLowerCase()
            .includes(dimensionFilter.toLowerCase())
        : true;

      return matchesName && matchesType && matchesDimension;
    });

    setFilteredLocations(filtered);
    setCurrentPage(1); 
  };

  
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  const displayedLocations = filteredLocations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        <div className="flex justify-center space-x-2 items-center h-full">
          <Spinner />
          <p className="text-center">Loading locations...</p>
        </div>
      ) : 
      displayedLocations.length > 0 ? (
        <>
          <div className="grid gap-4">
            {displayedLocations.map((location) => (
              <div key={location.id} className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">{location.name}</h3>
                <p className="text-sm text-gray-300">Type: {location.type}</p>
                <p className="text-sm text-gray-300">
                  Dimension: {location.dimension}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-green-500 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="bg-green-500 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-white">No locations found</p>
      )}
    </section>
  );
}
