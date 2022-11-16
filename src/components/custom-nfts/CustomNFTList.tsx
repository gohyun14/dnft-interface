import { OwnedNft } from 'alchemy-sdk';
import CustomNFTCard from './CustomNFTCard';

type CustomNFTListProps = {
  ownedNfts: OwnedNft[];
  emptyMessage: string;
  title?: string;
};

const CustomNFTList = ({
  ownedNfts,
  emptyMessage,
  title,
}: CustomNFTListProps) => {
  return (
    <div className="mx-auto max-w-2xl py-8 px-4 sm:px-6 sm:pt-12 sm:pb-6 lg:max-w-7xl lg:px-8">
      {title && (
        <h1 className="mb-4 text-center text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl">
          {title}
        </h1>
      )}
      <div className="flex flex-row flex-nowrap gap-x-2 overflow-x-auto rounded border bg-indigo-50 px-6 pb-6 pt-2">
        {ownedNfts.length > 0 ? (
          ownedNfts.map((nft) => (
            <CustomNFTCard
              key={nft.tokenId}
              tokenId={nft.tokenId}
              uri={nft.tokenUri}
            />
          ))
        ) : (
          <section>{emptyMessage}</section> //TODO: style
        )}
      </div>
    </div>
  );
};

export default CustomNFTList;
