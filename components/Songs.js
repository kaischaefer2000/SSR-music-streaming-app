import React from 'react'
import Song from './Song'

function Songs({ currentPlaylist }) {

  const currentPlaylistTracks = currentPlaylist !== undefined ? currentPlaylist?.tracks : undefined;
  const currentPlaylistTracksItems = currentPlaylistTracks !== undefined ? currentPlaylistTracks.items : []
  
  return (
    <div className="flex flex-col space-y-1 px-8 pb-28 text-white">
      {currentPlaylistTracksItems.map((item, index) => (
        <Song key={item.track.id} track={item} order={index} />
      ))}
    </div>
  );
}

export default Songs