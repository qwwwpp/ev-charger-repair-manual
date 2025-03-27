import { VideoTutorial } from "@/lib/types";
import { useAppContext } from "@/lib/context";
import { Link } from "wouter";
import VideoTutorialCard from "./VideoTutorialCard";

interface RelatedVideosProps {
  videos: VideoTutorial[];
  errorCodeId?: number;
}

const RelatedVideos = ({ videos, errorCodeId }: RelatedVideosProps) => {
  const { translate } = useAppContext();

  if (!videos || videos.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">{translate('related_videos')}</h3>
        <div className="p-4 border rounded-lg bg-gray-50 text-center">
          <p className="text-gray-500">{translate('no_videos')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{translate('related_videos')}</h3>
        <Link to="/videos" className="text-sm text-primary hover:underline">
          {translate('all_videos')}
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <VideoTutorialCard key={video.id} video={video} compact />
        ))}
      </div>
    </div>
  );
};

export default RelatedVideos;