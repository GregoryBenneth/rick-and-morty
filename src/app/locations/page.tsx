"use client";
import LocationList from "../components/location-list";

export default function LocationsPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 text-green-400">
        Rick and Morty Locations
      </h1>
      <LocationList />
    </main>
  );
}
