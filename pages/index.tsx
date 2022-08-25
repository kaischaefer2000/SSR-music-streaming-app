import type { NextPage } from 'next';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Center from '../components/Center';
import { getSession, signIn, useSession } from 'next-auth/react';
import Player from '../components/Player';
//@ts-ignore
import SpotifyWebApi from 'spotify-web-api-node';
import { useEffect } from 'react';
import React from 'react';

//@ts-ignore
const Home: NextPage = ({ artists, playlists, currentPlaylist }) => {
  const [songInfo, setSongInfo] = React.useState({});
  const { data: session } = useSession();

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

  //@ts-ignore
  useEffect(() => {
    spotifyApi.getMyCurrentPlayingTrack().then(async (data: any) => {
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

export default Home;

// When a components updates, the whole page gets rerendered on the server
export async function getServerSideProps(context: any) {
  
  // get session data, to check if the request is authorized
  const session = await getSession(context);

  // initializing spotify API with credentials
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

  // fetch artists data
  const artists = await fetch(
    `https://api.spotify.com/v1/me/following?type=artist`,
    {
      headers: {
        Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
      },
    },
  ).then((res) => res.json());

  // get playlist data
  const getPlaylists = async () => {
    if (session) {
      return spotifyApi.getUserPlaylists().then((data: any) => {
        return data.body.items;
      });
    } else {
      return [];
    }
  };
  const playlists = await getPlaylists();

  // get data of the currently selected playlist
  const getCurrentPlaylist = async () => {
    if (session) {
      return spotifyApi
        .getPlaylist('37i9dQZF1DZ06evO0nT692')
        .then((data: any) => {
          return data.body;
        })
        .catch((err: any) => console.log(err));
    } else {
      return [];
    }
  };
  const currentPlaylist = await getCurrentPlaylist();

  return {
    props: {
      session,
      artists,
      playlists,
      currentPlaylist,
    },
  };
}
