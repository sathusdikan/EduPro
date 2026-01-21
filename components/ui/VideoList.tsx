"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlayCircle, Lock } from "lucide-react";

function getEmbedUrl(url?: string) {
  if (!url) return null;

  // Supports:
  // https://www.youtube.com/watch?v=ID
  // https://youtu.be/ID
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
          <Card key={video.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {video.title}
                {!hasAccess && <Lock className="h-5 w-5 text-orange-500" />}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {hasAccess ? (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveVideoId(video.id)}
                    className="text-blue-600 hover:underline inline-flex items-center gap-2"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Watch Video
                  </button>

                  {activeVideoId === video.id && embedUrl && (
                    <div className="mt-4 aspect-video w-full">
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
                <div className="flex items-center gap-2 text-orange-600">
                  <Lock className="h-4 w-4" />
                  <span className="text-sm">Upgrade to unlock</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
