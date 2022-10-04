import React from 'react';
import Image from 'next/image';

interface NFTCardProps {
  name: string | undefined;
  image: string | undefined;
  key: string | undefined;
  onClick: () => void;
}

const NFTCard = ({ name, image, key, onClick }: NFTCardProps) => {
  return (
    <div
      key={key}
      onClick={onClick}
      className="group relative mx-4 mt-4 duration-200 motion-safe:hover:scale-105"
    >
      <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
        <img
          src={image !== undefined ? image : ''}
          alt={name}
          className="h-full w-full object-cover object-center"
          // height="250px"
          // width="250px"
        />
      </div>
      <h3 className="mt-1 w-full overflow-hidden text-ellipsis whitespace-nowrap text-lg text-gray-700">
        <a href="#">
          <span className="absolute inset-0" />
          {name}
        </a>
      </h3>
    </div>
  );
};

export default NFTCard;
