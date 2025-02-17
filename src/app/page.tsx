"use client";
import CharacterList from "./components/character-list";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 text-green-400">
        Rick and Morty Explorer
      </h1>

      <CharacterList />
    </main>
  );
}
