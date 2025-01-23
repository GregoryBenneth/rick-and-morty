"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
}

interface EpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  episodes: Episode[];
  characterName: string;
}

export function EpisodeModal({
  isOpen,
  onClose,
  episodes,
  characterName,
}: EpisodeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-400 mb-4">
            {characterName}'s Episodes
          </DialogTitle>
        </DialogHeader>
        <ul className="space-y-2">
          {episodes.map((episode) => (
            <li key={episode.id} className="bg-gray-700 p-3 rounded-lg">
              <h3 className="font-semibold text-lg text-green-300">
                {episode.name}
              </h3>
              <p className="text-sm text-gray-300">
                Episode: {episode.episode}
              </p>
              <p className="text-sm text-gray-300">
                Air Date: {episode.air_date}
              </p>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
