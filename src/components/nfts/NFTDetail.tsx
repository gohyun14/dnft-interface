import { useState } from 'react';
import { OwnedNft } from 'alchemy-sdk';
import { Dialog } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { PhotoIcon } from '@heroicons/react/24/outline';

type NFTDetailProps = {
  nft: OwnedNft | undefined;
  onClose: () => void;
};

const NFTDetail = ({ nft, onClose }: NFTDetailProps) => {
  const [imageError, setImageError] = useState<boolean>(false);

  return (
    <div>
      <button
        type="button"
        className="absolute right-1 top-1"
        onClick={onClose}
      >
        <XCircleIcon
          className="h-5 w-5 text-indigo-600 hover:text-indigo-700"
          aria-hidden="true"
        />
      </button>
      <div className="h-full max-h-[350px] w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
        {!imageError ? (
          <img
            src={nft?.rawMetadata?.image}
            alt={nft?.rawMetadata?.image}
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
            <p className="mb-6 text-center text-gray-600">Image not found...</p>
          </div>
        )}
      </div>
      <div className="mt-3 text-center sm:mt-5">
        <Dialog.Title
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900"
        >
          {nft?.title}
        </Dialog.Title>
        <div className=" mt-2 max-h-20 overflow-hidden text-ellipsis">
          <p className="text-sm text-gray-500">
            {nft?.rawMetadata?.description}
          </p>
        </div>
      </div>
      {nft?.rawMetadata?.attributes != undefined && (
        <div className="mt-2 flex flex-row flex-wrap justify-center sm:mt-2">
          {nft?.rawMetadata?.attributes?.map((attribute) => (
            <span
              key={attribute.trait_type + ' ' + attribute.value}
              className="mx-0.5 my-0.5 inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium text-indigo-800 duration-200 motion-safe:hover:scale-105"
            >
              {attribute.trait_type}: {attribute.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default NFTDetail;
