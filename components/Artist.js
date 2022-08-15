import React from 'react'
import Image from 'next/image';

function Artist({name,  images}) {
    
  return (
    <div className="h-70 w-50 my-4 mx-[1vw] rounded bg-gray-900 p-4 hover:bg-gray-800">
      <Image
        width="176px"
        height="176px"
        className="h-44 w-44 rounded-full shadow-2xl"
        src={images[0].url}
        alt="Artists cover"
      />
      <div className="mt-4">{name}</div>
      <div className="text-gray-400">Künstler*in</div>
    </div>
  );
}

export default Artist