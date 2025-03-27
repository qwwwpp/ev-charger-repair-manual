import { VideoTutorial } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context";
import { Play, Clock } from "lucide-react";

interface VideoTutorialCardProps {
  video: VideoTutorial;
  compact?: boolean;
}

const VideoTutorialCard = ({ video, compact = false }: VideoTutorialCardProps) => {
  const { translate } = useAppContext();
  
  // Use placeholder thumbnail if none is provided
  const thumbnailUrl = video.thumbnailUrl || 'https://placehold.co/600x400/e6e6e6/7C7C7C?text=Video';

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${compact ? 'h-full' : ''}`}>
      <div className="relative overflow-hidden aspect-video bg-gray-100">
        <img 
          src={thumbnailUrl} 
          alt={video.title} 
          className="object-cover w-full h-full transition-all hover:scale-105"
        />
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{video.duration}</span>
          </div>
        )}
      </div>
      
      <CardHeader className={compact ? "p-3" : "p-4"}>
        <CardTitle className={`line-clamp-1 ${compact ? "text-sm" : "text-base"}`}>
          {video.title}
        </CardTitle>
        {!compact && (
          <CardDescription className="line-clamp-2 text-sm">
            {video.description}
          </CardDescription>
        )}
      </CardHeader>
      
      {!compact && (
        <CardContent className="p-4 pt-0">
          {video.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {video.description}
            </p>
          )}
        </CardContent>
      )}
      
      <CardFooter className={`${compact ? "p-3 pt-0" : "p-4"}`}>
        <Button 
          variant="outline" 
          size={compact ? "sm" : "default"}
          className="w-full text-primary hover:text-primary hover:bg-primary/5"
          onClick={() => window.open(video.url, '_blank')}
        >
          <Play className="w-4 h-4 mr-2" />
          {translate('watch_video')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VideoTutorialCard;