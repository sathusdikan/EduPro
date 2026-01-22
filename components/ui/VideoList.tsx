"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlayCircle, Lock } from "lucide-react";

function getEmbedUrl(url?: string) {
  if (!url) return null;

  if (url.includes("youtu.be")) {
    return `https://www.youtube.com/embed/${url.split("youtu.be/")[1]}`;
  }

  if (url.includes("watch?v=")) {
    return `https://www.youtube.com/embed/${url.split("v=")[1].split("&")[0]}`;
  }

  return null;
}

export default function VideoList({
  videos,
  hasAccess,
}: {
  videos: any[];
  hasAccess: boolean;
}) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {videos.map((video) => {
        const embedUrl = getEmbedUrl(video.youtube_url);

        return (
          <Card
            key={video.id}
            className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] p-4"
          >
            {/* Animated glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 rounded-xl pointer-events-none transition-opacity duration-500 blur-xl"></div>

            {/* Header */}
            <CardHeader className="p-0 mb-3 z-10 relative">
              <CardTitle className="flex justify-between items-center text-lg md:text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                {video.title}
                {!hasAccess && (
                  <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full text-sm font-medium">
                    <Lock className="h-4 w-4" /> Locked
                  </div>
                )}
              </CardTitle>
            </CardHeader>

            {/* Content */}
            <CardContent className="p-0 z-10 relative">
              {hasAccess ? (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveVideoId(video.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all shadow-md hover:shadow-xl transform hover:scale-[1.05] motion-safe:animate-pulse"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Watch Video
                  </button>

                  {activeVideoId === video.id && embedUrl && (
                    <div className="mt-4 aspect-video w-full rounded-lg overflow-hidden shadow-lg animate-fadeIn">
                      <iframe
                        src={embedUrl}
                        className="w-full h-full rounded-lg"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 mt-2 text-orange-600 text-sm font-medium">
                  <Lock className="h-4 w-4" />
                  Upgrade to unlock
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
