'use client';

import React, { useEffect, useState } from 'react';
import { generateSubtitles, getCurrentSubtitle, SubtitleLanguage } from '@/lib/subtitles';

interface SubtitleDisplayProps {
  currentTime: number;
  duration: number;
  tags?: string[];
  title?: string;
  language: SubtitleLanguage;
}

export const SubtitleDisplay: React.FC<SubtitleDisplayProps> = ({
  currentTime,
  duration,
  tags,
  title,
  language,
}) => {
  const [subtitle, setSubtitle] = useState<string | null>(null);

  useEffect(() => {
    if (duration <= 0) return;

    const segments = generateSubtitles(tags || [], duration, title);
    const currentSubtitle = getCurrentSubtitle(segments, currentTime, language);
    setSubtitle(currentSubtitle);
  }, [currentTime, duration, tags, title, language]);

  if (!subtitle) return null;

  return (
    <div className="absolute bottom-20 left-0 right-0 text-center z-10 pointer-events-none">
      <div className="inline-block bg-black/85 backdrop-blur-sm px-6 py-3 rounded-lg text-white text-base sm:text-lg font-medium max-w-[90%] mx-auto shadow-lg border border-white/10">
        {subtitle}
      </div>
    </div>
  );
};

