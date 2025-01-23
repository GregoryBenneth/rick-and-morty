"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { EpisodeModal } from "./episode-modal";
import Spinner from "./ui/spinner";

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
  episode: string[];
}

interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
}

export default function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 8;

  useEffect(() => {
    fetchAllCharacters();
  }, [statusFilter, speciesFilter, typeFilter, genderFilter]);

  useEffect(() => {
    handleFilterCharacters();
  }, [nameFilter, characters]);

  const fetchAllCharacters = async () => {
    setLoading(true);
    let allCharacters: Character[] = [];
    let nextPage = 1;

    try {
      while (nextPage) {
        const queryParams = new URLSearchParams({
          page: nextPage.toString(),
          ...(statusFilter && { status: statusFilter }),
          ...(speciesFilter && { species: speciesFilter }),
          ...(typeFilter && { type: typeFilter }),
          ...(genderFilter && { gender: genderFilter }),
        });

        const response = await fetch(
          `https://rickandmortyapi.com/api/character?${queryParams.toString()}`
        );
        const data = await response.json();

        if (data.results) {
          allCharacters = [...allCharacters, ...data.results];
        }

        nextPage = data.info?.next ? nextPage + 1 : 0;
      }

      setCharacters(allCharacters);
      setFilteredCharacters(allCharacters);
    } catch (error) {
      console.error("Error fetching characters:", error);
      setCharacters([]);
      setFilteredCharacters([]);
    }
    setLoading(false);
  };

  const handleFilterCharacters = () => {
    if (!nameFilter.trim()) {
      setFilteredCharacters(characters);
      setCurrentPage(1);
      return;
    }

    const searchTerms = nameFilter.toLowerCase().split(" ");
    const filtered = characters.filter((character) => {
      const characterName = character.name.toLowerCase();
      return searchTerms.every((term) => characterName.includes(term));
    });

    setFilteredCharacters(filtered);
    setCurrentPage(1);
  };

  const fetchEpisodes = async (character: Character) => {
    setSelectedCharacter(character);
    try {
      const episodePromises = character.episode.map((url) =>
        fetch(url).then((res) => res.json())
      );
      const episodeData = await Promise.all(episodePromises);
      setEpisodes(episodeData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching episodes:", error);
    }
  };

  const totalPages = Math.ceil(filteredCharacters.length / itemsPerPage);
  const displayedCharacters = filteredCharacters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-400">Characters</h2>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        >
          <option value="">All Statuses</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>
        <input
          type="text"
          placeholder="Filter by species"
          value={speciesFilter}
          onChange={(e) => setSpeciesFilter(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        />
      </div>
      {loading ? (
        <div className="flex justify-center space-x-2 items-center h-full">
          <Spinner />
          <p className="text-center">Loading characters...</p>
        </div>
      ) : displayedCharacters.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayedCharacters.map((character) => (
              <div
                key={character.id}
                className="bg-gray-700 p-2 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => fetchEpisodes(character)}
              >
                <Image
                  src={character.image || "/placeholder.svg"}
                  alt={character.name}
                  width={200}
                  height={200}
                  className="rounded-lg mb-2"
                />
                <h3 className="font-semibold">{character.name}</h3>
                <p className="text-sm text-gray-300">
                  {character.species} - {character.status}
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
        <p className="text-center">No characters found</p>
      )}
      {selectedCharacter && (
        <EpisodeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          episodes={episodes}
          characterName={selectedCharacter.name}
        />
      )}
    </section>
  );
}
