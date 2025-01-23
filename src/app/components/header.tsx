"use client";

import { useState } from "react";
import Link from "next/link";

const tabs = [
  { name: "Characters", href: "/" },
  { name: "Locations", href: "/locations" },
  { name: "Episodes", href: "/episodes" },
];

export default function Header() {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  return (
    <header className="bg-gray-800 p-4">
      <nav className="flex justify-center space-x-4">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === tab.name
                ? "bg-gray-900 text-green-400"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
