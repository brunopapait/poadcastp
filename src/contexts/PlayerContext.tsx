import React, { createContext, useState, ReactNode } from 'react';

interface Episode {
  id: string;
  title: string;
  members: string;
  thumbnail: string,
  description: string;
  duration: string;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

interface PlayerContextData {
  episodeList: Array<Episode>;
  currentEpisodeIndex: number;
  isPlaying: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  isLoopping: boolean;
  isShufflyng: boolean;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setPlayingState: (state: boolean) => void;
  play: (episode: Episode) => void;
  playList: (list: Array<Episode>, index: number) => void;
  toggleLooping: () => void;
  toggleShufflyng: () => void;
  clearPlayerState: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData);

interface PlayerContextProviderProps {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoopping, setIsLooping] = useState(false);
  const [isShufflyng, setIsShufflyng] = useState(false);

  const play = (episode: Episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  const playList = (list: Array<Episode>, index: number) => {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  const togglePlay = () => {
    setIsPlaying(prevState => !prevState);
  }

  const toggleLooping = () => {
    setIsLooping(prevState => !prevState);
  }

  const toggleShufflyng = () => {
    setIsShufflyng(prevState => !prevState);
  }

  const setPlayingState = (state: boolean) => {
    setIsPlaying(state);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShufflyng || (currentEpisodeIndex + 1) < episodeList.length;

  const playNext = () => {
    if (isShufflyng) {
      const nextRandomEpisodeList = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeList);
    } else
      hasNext && setCurrentEpisodeIndex(currentEpisodeIndex + 1);
  }

  const playPrevious = () => {
    hasPrevious && setCurrentEpisodeIndex(currentEpisodeIndex - 1);
  }

  const clearPlayerState = () => {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        playNext,
        playPrevious,
        isPlaying,
        togglePlay,
        setPlayingState,
        playList,
        hasNext,
        hasPrevious,
        toggleLooping,
        isLoopping,
        isShufflyng,
        toggleShufflyng,
        clearPlayerState
      }}>
      {children}
    </PlayerContext.Provider>
  )
}