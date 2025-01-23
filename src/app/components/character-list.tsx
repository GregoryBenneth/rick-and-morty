"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { EpisodeModal } from "./episode-modal";

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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCharacters();
  }, [page]);

  useEffect(() => {
    filterCharacters();
  }, [characters, nameFilter, statusFilter, speciesFilter]);

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character?page=${page}`
      );
      const data = await response.json();
      setCharacters(data.results);
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
    setLoading(false);
  };

  const filterCharacters = () => {
    let filtered = characters;
    if (nameFilter) {
      filtered = filtered.filter((char) =>
        char.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(
        (char) => char.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    if (speciesFilter) {
      filtered = filtered.filter((char) =>
        char.species.toLowerCase().includes(speciesFilter.toLowerCase())
      );
    }
    setFilteredCharacters(filtered);
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
        <p className="text-center">Loading characters...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredCharacters.map((character) => (
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
