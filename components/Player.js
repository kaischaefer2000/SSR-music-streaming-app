import React, { useEffect } from 'react';
import { VolumeUpIcon as VolumeDownIcon } from '@heroicons/react/outline';
import {
  RewindIcon,
  FastForwardIcon,
  PlayIcon,
  VolumeUpIcon,
} from '@heroicons/react/solid';
import { debounce } from 'lodash';
import SpotifyWebApi from 'spotify-web-api-node';
import { useSession } from 'next-auth/react';

function Player({ songInfo }) {

  const { data: session } = useSession();

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
  });

  spotifyApi.setAccessToken(session?.user?.accessToken);

  const [volume, setVolume] = React.useState(50);

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
      } else {
        spotifyApi.play();
      }
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      setVolume(50);
    }
  }, [spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const debouncedAdjustVolume = React.useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 300),
    [],
  );

  return (
    <div className="grid h-24 grid-cols-3 bg-gradient-to-b from-black to-gray-900 px-2 text-xs text-white md:px-8 md:text-base">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden h-10 w-10 md:inline"
          src={songInfo?.album?.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center justify-evenly">
        <RewindIcon
          onClick={() => spotifyApi.skipToPrevious()}
          className="button"
        />

        <PlayIcon onClick={handlePlayPause} className="button h-10 w-10" />

        <FastForwardIcon
          onClick={() => spotifyApi.skipToNext()}
          className="button"
        />
      </div>

      {/* Right */}
      <div className="flex items-center justify-end space-x-3 pr-5 md:space-x-4">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  );
}

export default Player;
