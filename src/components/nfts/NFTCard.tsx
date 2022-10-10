import { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface NFTCardProps {
  name: string | undefined;
  image: string | undefined;
  onClick: () => void;
}

const NFTCard = ({ name, image, onClick }: NFTCardProps) => {
  const [imageError, setImageError] = useState<boolean>(false);

  return (
    <div
      onClick={onClick}
      className="group relative mx-4 mt-4 duration-200 motion-safe:hover:scale-105"
    >
      <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
        {!imageError ? (
          <img
            src={image !== undefined ? image : ''}
            alt={name}
            className="h-full w-full object-cover object-center"
            onError={() => setImageError(true)}
            // height="250px"
            // width="250px"
          />
        ) : (
          <div>
            <PhotoIcon
              className="mx-auto mt-2 h-40 w-40 text-gray-500"
              aria-hidden="true"
            />
            <p className="text-center text-gray-600">Image not found...</p>
          </div>
        )}
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
