import { useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { PlayerContext } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';
import { convertDuractionToTimeString } from '../../utils/convertDuractionToTimeString';

export default function Player() {
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    currentEpisodeIndex,
    episodeList,
    isPlaying,
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isLoopping,
    toggleLooping,
    isShufflyng,
    toggleShufflyng,
    clearPlayerState
  } = useContext(PlayerContext);

  useEffect(() => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.play() : audioRef.current.pause();

  }, [isPlaying]);

  const episode = episodeList[currentEpisodeIndex];

  const setupProgressListener = () => {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  const handleChangeSlider = (amount: number) => {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  const handledEpisodeEnd = () => {
    hasNext ? playNext() : clearPlayerState
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {
        episode ?
          <div className={styles.currentEpisode}>
            <Image
              width={592}
              height={592}
              src={episode.thumbnail}
              objectFit='cover'
            />
            <strong>{episode.title}</strong>
            <span>{episode.members}</span>
          </div> :
          <div className={styles.emptyPlayer}>
            <strong>Selecione um poadcast para ouvir</strong>
          </div>
      }
      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDuractionToTimeString(progress)}</span>
          <div className={styles.slider}>
            {
              episode ?
                <Slider
                  max={Number(episode.duration)}
                  value={progress}
                  onChange={handleChangeSlider}
                  trackStyle={{ backgroundColor: '#84D361' }}
                  railStyle={{ backgroundColor: '#9F75FF' }}
                  handleStyle={{ borderColor: '#84D361', borderWidth: 4 }}
                /> :
                <div className={styles.emptySlider} />
            }
          </div>
          <span>{episode?.durationAsString ?? '00:00'}</span>
        </div>
        {
          episode &&
          <audio
            ref={audioRef}
            src={episode.url}
            autoPlay
            onEnded={handledEpisodeEnd}
            loop={isLoopping}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        }
        <div className={styles.buttons}>
          <button className={isShufflyng ? styles.isActive : ''} type={'button'} disabled={!episode || episodeList.length === 1} onClick={toggleShufflyng}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type={'button'} disabled={!episode || !hasPrevious} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button className={styles.playButton} type={'button'} onClick={togglePlay} disabled={!episode}>
            {isPlaying ?
              <img src="/pause.svg" alt="Pausar" /> :
              <img src="/play.svg" alt="Tocar" />}
          </button>
          <button type={'button'} disabled={!episode || !hasNext} onClick={playNext}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button className={isLoopping ? styles.isActive : ''} type={'button'} disabled={!episode} onClick={toggleLooping}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}