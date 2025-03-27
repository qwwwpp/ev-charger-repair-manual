import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/lib/context";
import VideoTutorialCard from "@/components/VideoTutorialCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { VideoTutorial } from "@/lib/types";

const VideoTutorialsPage = () => {
  const { translate } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all video tutorials
  const { data: videos, isLoading, isError } = useQuery<VideoTutorial[]>({
    queryKey: ["/api/videos"],
  });

  // Filter videos based on search query
  const filteredVideos = videos?.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">{translate("video_tutorials")}</h1>

      {/* Search bar */}
      <div className="relative mb-6">
        <Input
          type="text"
          placeholder={`${translate("search_placeholder")}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-full"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-8 w-full rounded" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-10">
          <p className="text-red-500">Failed to load video tutorials.</p>
        </div>
      ) : filteredVideos && filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoTutorialCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg bg-gray-50">
          <p className="text-gray-500 mb-2">{translate("no_videos")}</p>
          {searchQuery && (
            <p className="text-sm text-gray-400">
              {translate("try_different")}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoTutorialsPage;