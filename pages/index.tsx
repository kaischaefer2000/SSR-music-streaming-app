import type { NextPage } from 'next';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Center from '../components/Center';
import { getSession, signIn } from 'next-auth/react';
import Player from '../components/Player';
//@ts-ignore
import SpotifyWebApi from 'spotify-web-api-node';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { playlistIdState } from '../atoms/playlistAtom';

//@ts-ignore
const Home: NextPage = ({ artists, playlists, currentPlaylist }) => {
  return (
    <div className="h-screen overflow-hidden bg-black">
      <Head>
        <title>Music Streaming App</title>
      </Head>
      <main className="flex">
        <Sidebar playlists={playlists} />
        <Center artists={artists} currentPlaylist={currentPlaylist}/>
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
};

export default Home;

// when a components updates, the whole page gets rerendered on the server
export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
  });
  const playlistId = useRecoilValue(playlistIdState);

  //set Access Token
  if (session) {
    if (session.error === 'RefreshAccessTokenError') {
      signIn();
    }
    //@ts-ignore
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
      return spotifyApi.getUserPlaylists().then((data: any) => {
        return data.body.items;
      })
    } else {
      return [];
    }
  };
  const playlists =  await getPlaylists();

  const getCurrentPlaylist = async () => {
    if (session) {
      return spotifyApi
        .getPlaylist(playlistId)
        .then((data: any) => {
          return data.body;
        })
        .catch((err:any) => console.log(err));
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
