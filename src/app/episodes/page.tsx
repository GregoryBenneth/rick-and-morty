"use client";
import EpisodeList from "../components/episodes";

export default function EpisodesPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 text-green-400">
        Rick and Morty Episodes
      </h1>
      <EpisodeList />
    </main>
  );
}
