import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Center from '../components/Center';
import { useSession, getSession, signIn } from 'next-auth/react';
import Player from '../components/Player';
import SpotifyWebApi from 'spotify-web-api-node';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const PlaylistPage = ({ artists, playlists }) => {
  const router = useRouter();
  const { playlist } = router.query;
  const { data: session } = useSession();
  const [currentPlaylist, setCurrentPlaylist] = React.useState({});
  const [songInfo, setSongInfo] = React.useState({});

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
  });

  //set Access Token
  if (session) {
    if (session.error === 'RefreshAccessTokenError') {
      signIn();
    }
    //@ts-ignore
    spotifyApi.setAccessToken(session?.user?.accessToken);
  }

  useEffect(() => {
    spotifyApi.getMyCurrentPlayingTrack().then(async (data) => {
      const trackInfo = await fetch(
        `https://api.spotify.com/v1/tracks/${data.body?.item?.id}`,
        {
          headers: {
            // pass access token in order to be authorized to fetch the song info
            Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
          },
        },
      ).then((res) => res.json());

      setSongInfo(trackInfo);
    });
  }, []);

  useEffect(() => {
    const getCurrentPlaylist = async () => {
      if (session) {
        if (session.error === 'RefreshAccessTokenError') {
          signIn();
        }
        spotifyApi.setAccessToken(session?.user?.accessToken);

        return spotifyApi
          .getPlaylist(playlist)
          .then((data) => {
            return data.body;
          })
          .catch((err) => console.log(err));
      } else {
        return [];
      }
    };

    getCurrentPlaylist().then((data) => {
      setCurrentPlaylist(data);
    });
  }, [playlist]);

  return (
    <div className="h-screen overflow-hidden bg-black">
      <Head>
        <title>Music Streaming App</title>
      </Head>
      <main className="flex">
        <Sidebar playlists={playlists} />
        <Center artists={artists} currentPlaylist={currentPlaylist} />
      </main>
      <div className="sticky bottom-0">
        <Player songInfo={songInfo} />
      </div>
    </div>
  );
};

export default PlaylistPage;

// when a components updates, the whole page gets rerendered on the server
export async function getServerSideProps(context) {
  const session = await getSession(context);
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
  });

  //set Access Token
  if (session) {
    if (session.error === 'RefreshAccessTokenError') {
      signIn();
    }
    spotifyApi.setAccessToken(session?.user?.accessToken);
  }

  const artists = await fetch(
    `https://api.spotify.com/v1/me/following?type=artist`,
    {
      headers: {
        Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
      },
    },
  ).then((res) => res.json());

  const getPlaylists = async () => {
    if (session) {
      return spotifyApi.getUserPlaylists().then((data) => {
        return data.body.items;
      });
    } else {
      return [];
    }
  };
  const playlists = await getPlaylists();

  return {
    props: {
      session,
      artists,
      playlists,
    },
  };
}
