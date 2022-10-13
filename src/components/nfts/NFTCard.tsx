import { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { IKImage } from 'imagekitio-react';

interface NFTCardProps {
  name: string | undefined;
  image: string | undefined;
  onClick: () => void;
}

const NFTCard = ({ name, image, onClick }: NFTCardProps) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  const urlEndpoint = 'https://ik.imagekit.io/thbgrljbi/';

  return (
    <div
      onClick={onClick}
      className="group relative mx-4 mt-4 duration-200 motion-safe:hover:scale-[1.02]"
    >
      <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
        {imageLoading && (
          <div className=" mx-auto h-full w-full animate-pulse bg-gray-400">
            &nbsp;
          </div>
        )}
        {!imageError ? (
          <IKImage
            urlEndpoint={urlEndpoint}
            src={image !== undefined ? image : ''}
            alt={name}
            className="h-full w-full object-cover object-center"
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
            onLoad={() => {
              setImageLoading(false);
            }}
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
