import React  from 'react';
import Songs from '../components/Songs';

function Playlist({ currentPlaylist }) {

  return (
    <React.Fragment>
      <section
        className={`flex h-72 items-end space-x-7 bg-gradient-to-b from-red-500 to-black p-8 text-white `}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={currentPlaylist?.images[0]?.url}
          alt="Playlist cover"
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl">
            {currentPlaylist?.name}
          </h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </React.Fragment>
  );
}

export default Playlist