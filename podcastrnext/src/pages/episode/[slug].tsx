import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import Image from 'next/image';
import Link from 'next/link';
import styles from './episode.module.scss';
import { PlayerContext } from '../../contexts/PlayerContext';
import { useContext } from 'react';

type Episode = {
    id: string;
    title: string;
    members: string;
    published_at: string;
    thumbnail: string;
    url: string;
    duration: number;
    durationAsString: string;
    description: string;
};

type EpisodeProps = {
    episode: Episode;
}

export default function Episode ({episode} : EpisodeProps) {
    const { play } = useContext(PlayerContext)
    const router = useRouter();
    if(router.isFallback) {
        <p> Carregando... </p>
    }

    return (
        <div className={styles.episode}> 
            <div className={styles.thumbnailContainer}> 
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>
                <Image 
                    className={styles.imagem}
                    width={800} 
                    height={200} 
                    src={episode.thumbnail} 
                    alt={episode.title} 
                    objectFit= "cover"
                />
                <button type="button" onClick={() => play(episode)} >
                    <img src="/play.svg" alt="Tocar episódio" />
                </button>
            </div>

            <header>
                <h1> {episode.title} </h1>
                <span> {episode.members} </span>
                <span> {episode.durationAsString} </span>
                <span> {episode.published_at} </span>
            </header>

            <div 
                className={styles.description}
                dangerouslySetInnerHTML ={{ __html: episode.description}}
            />
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('episodes', {
        params: { 
          _limit: 2, 
          _sort: 'published_at', 
          _order: 'desc'
        }
    })

    const paths = data.map(episode => {
        return {
            params: {
                slug: episode.id,
            }
        }
    })

    return{
        paths, //paths: [], se paths vazio nenhum elemento está sendo criado de forma estatica 
        fallback: 'blocking' // false, não busca nenhum path que não esteja em params - true, busca apenas no client - 'blocking', next.js(no server) melhor opção para SEO
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        members: data.members,
        published_at: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR}),
        thumbnail: data.thumbnail,
        description: data.description,
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        url: data.file.url,
    };

    return {
        props: {
          episode,
        },
        revalidate: 60 * 60 * 24, // 60 segundos x 60 para chegar em uma hora x 24 pra ser 24h
    }
}