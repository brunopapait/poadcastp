import { GetStaticProps } from 'next';
import Image from 'next/image';

import Link from 'next/link';

import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { api } from '../services/api';
import { convertDuractionToTimeString } from '../utils/convertDuractionToTimeString';

import styles from './home.module.scss';
import { useContext } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';

interface Episode {
  id: string;
  title: string;
  members: string;
  thumbnail: string,
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
}
interface HomeProps {
  allEpisodes: Array<Episode>;
  latestEpisodes: Array<Episode>;
}

export default function Home({ allEpisodes, latestEpisodes }: HomeProps) {

  const { playList } = useContext(PlayerContext);

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((item, index) => (
            <li key={item.id}>
              <Image
                width={192}
                height={192}
                src={item.thumbnail}
                alt={item.title}
                objectFit="cover"
              />
              <div className={styles.episodeDetails}>
                <Link href={`/episodes/${item.id}`}>
                  <a>{item.title}</a>
                </Link>
                <p>{item.members}</p>
                <span>{item.publishedAt}</span>
                <span>{item.durationAsString}</span>
              </div>

              <button type='button'>
                <img src="/play-green.svg" alt="Tocar episódio" onClick={() => playList(episodeList, index)} />
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Poadcast</th>
              <th>Integrantes</th>
              <th style={{ width: 100 }}>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <Image
                    width={120}
                    height={120}
                    src={item.thumbnail}
                    alt={item.title}
                    objectFit="cover"
                  />
                </td>
                <td>
                  <Link href={`/episodes/${item.id}`}>
                    <a>{item.title}</a>
                  </Link>
                </td>
                <td>{item.members}</td>
                <td>{item.publishedAt}</td>
                <td>{item.durationAsString}</td>
                <td>
                  <button type='button' onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map(item => {
    return {
      id: item.id,
      title: item.title,
      thumbnail: item.thumbnail,
      members: item.members,
      publishedAt: format(parseISO(item.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(item.file.duration),
      durationAsString: convertDuractionToTimeString(Number(item.file.duration)),
      url: item.file.url,
    }
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      allEpisodes,
      latestEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}
