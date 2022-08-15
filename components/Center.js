import { LogoutIcon} from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import Playlist from '../components/Playlist';
import Artists from '../components/Artists';
import { signOut } from 'next-auth/react';
import { useRecoilValue } from 'recoil';
import { siteState } from '../atoms/siteAtom';
import Image from 'next/image';

function Center({ artists, currentPlaylist }) {
  const { data: session } = useSession();
  const site = useRecoilValue(siteState);

  return (
    // the Center component takes as much space as possible for itself
    <div className="h-screen w-full overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div className="flex items-center space-x-3 rounded-full bg-black p-1 pr-3 text-white opacity-90">
          <Image
            width="40px"
            height="40px"
            className="h-10 w-10 rounded-full"
            src={session?.user.image}
            alt=""
          />
          <h2>{session?.user.name}</h2>
          <LogoutIcon
            className="h-4 w-4 cursor-pointer hover:opacity-80"
            onClick={() => signOut()}
          />
        </div>
      </header>

      {site === 'artists' ? (
        <Artists artists={artists} />
      ) : (
        <Playlist currentPlaylist={currentPlaylist} />
      )}
    </div>
  );
}

export default Center;
