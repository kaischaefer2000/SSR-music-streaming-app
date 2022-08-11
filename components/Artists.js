import React from 'react';
import Artist from './Artist';

function Artists({ artists }) {

  return (
    <React.Fragment>
      <section
        className={`h-50 flex items-end space-x-7 bg-gradient-to-b from-purple-800 to-black p-8 text-white `}
      >
        <h1 className="bold text-lg md:text-xl xl:text-3xl">Artists</h1>
      </section>
      <div className="flex flex-wrap p-4 pb-28 text-white ">
        {
          artists.artists.items.map((artist) => (
            <Artist key={artist.id} name={artist.name} images={artist.images} />
          ))
        }
      </div>
    </React.Fragment>
  );
}

export default Artists;
