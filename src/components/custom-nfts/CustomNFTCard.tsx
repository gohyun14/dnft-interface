import { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { IKImage } from 'imagekitio-react';
import { TokenUri } from 'alchemy-sdk';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface CustomNFTCardProps {
  uri: TokenUri | undefined;
  tokenId: string;
}

const CustomNFTCard = ({ uri, tokenId }: CustomNFTCardProps) => {
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  const urlEndpoint = 'https://ik.imagekit.io/thbgrljbi/';

  const ipfsRaw = uri?.raw.split('//')[1]?.split('/');
  const ipfsWeblink = ipfsRaw
    ? `https://${ipfsRaw[0]}.ipfs.dweb.link/${ipfsRaw[1]}`
    : undefined;

  const { isLoading, error, data, isFetching } = useQuery(['nftMetadata'], () =>
    axios.get(ipfsWeblink as string).then((res) => res.data)
  );

  const imageRaw = data?.image.split('//')[1]?.split('/');
  const imageWebLink = data
    ? `https://${imageRaw[0]}.ipfs.dweb.link/${imageRaw[1]}`
    : undefined;

  return (
    <div className="group relative mx-4 mt-4 rounded-md shadow-md duration-200 motion-safe:hover:scale-[1.01]">
      <div className="h-48 w-44 overflow-hidden rounded-md">
        {imageLoading && (
          <div className=" mx-auto h-full w-full animate-pulse bg-gray-400">
            &nbsp;
          </div>
        )}
        <IKImage
          urlEndpoint={urlEndpoint}
          src={imageWebLink !== undefined ? imageWebLink : ''}
          alt={data?.name}
          className="h-full w-full object-cover object-center"
          onLoad={() => {
            setImageLoading(false);
          }}
        />
      </div>
      <div className="rounded-md bg-white pb-2 text-center">
        <section className="mb-1 bg-white text-center font-semibold text-gray-800">
          #{tokenId}
        </section>
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-100"
        >
          Stake
        </button>
      </div>
    </div>
  );
};

export default CustomNFTCard;
