
import React from 'react';
import { cn } from '@/lib/utils';
import { ContentItem } from '@/components/ContentDisplay';

type VideoContentProps = {
  content: ContentItem;
  showSubtitles: boolean;
  className?: string;
};

const VideoContent: React.FC<VideoContentProps> = ({ content, showSubtitles, className }) => {
  return (
    <div className={cn("mb-6 rounded-lg overflow-hidden shadow-lg", className)}>
      <div className="relative aspect-video">
        <iframe 
          src={content.url} 
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
          title={content.title}
        ></iframe>
        {showSubtitles && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-center">
            Sample subtitle text would appear here when available
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoContent;
