import React from 'react';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '../atoms/playlistAtom';
import { siteState } from '../atoms/siteAtom';
import { UserGroupIcon } from '@heroicons/react/solid';
import Link from 'next/link';

function Sidebar({playlists}) {
  const [site, setSite] = useRecoilState(siteState);

  return (
    <div className="h-screen overflow-y-scroll border-r border-gray-900 p-5 pb-36 text-sm text-gray-500 scrollbar-hide sm:w-[12rem] md:inline-flex lg:w-[15rem] lg:text-sm">
      <div className="space-y-4">
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => setSite('artists')}
        >
          <UserGroupIcon className="h-4 w-4 text-blue-300" />
          <p>Artists</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-900" />

        {playlists.map((playlist) => (
          <p
            key={playlist.id}
            onClick={() => {
              setSite('playlist');
            }}
            className="cursor-pointer hover:text-white"
          >
            <Link href={'/' + playlist.id}>{playlist.name}</Link>
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
