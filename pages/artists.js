import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import { getSession, signIn, useSession } from 'next-auth/react';
import Player from '../components/Player';
import SpotifyWebApi from 'spotify-web-api-node';
import React from 'react';
import Artist from '../components/Artist';
import Image from 'next/image';
import { LogoutIcon } from '@heroicons/react/outline';

const ArtistPage = ({ artists, playlists }) => {
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

  React.useEffect(() => {
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

  return (
    <div className="h-screen overflow-hidden bg-black">
      <Head>
        <title>Music Streaming App</title>
      </Head>
      <main className="flex">
        <Sidebar playlists={playlists} />
        <div className="h-screen w-full overflow-y-scroll scrollbar-hide">
          <header className="absolute top-5 right-8 z-50">
            <div className="flex items-center space-x-3 rounded-full bg-black p-1 pr-3 text-white opacity-90 ">
              <Image
                width="40px"
                height="40px"
                className="h-10 w-10 rounded-full"
                src={session?.user.image ?? '/spotifyLogo.png'}
                alt=""
              />
              <h2>{session?.user.name}</h2>
              <LogoutIcon
                className="h-4 w-4 cursor-pointer hover:opacity-80"
                onClick={() => signOut()}
              />
            </div>
          </header>

          <section
            className={`h-50 flex items-end space-x-7 bg-gradient-to-b from-purple-800 to-black p-8 text-white `}
          >
            <h1 className="bold text-lg md:text-xl xl:text-3xl">Artists</h1>
          </section>
          <div className="flex flex-wrap p-4 pb-28 text-white ">
            {artists.artists.items.map((artist) => (
              <Artist
                key={artist.id}
                name={artist.name}
                images={artist.images}
              />
            ))}
          </div>
        </div>
      </main>
      <div className="sticky bottom-0">
        <Player songInfo={songInfo} />
      </div>
    </div>
  );
};

export default ArtistPage;

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

  // Get playlist data
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
      artists,
      playlists,
      session,
    },
  };
}
