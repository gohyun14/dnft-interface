import { useState } from 'react';
import { OwnedNft } from 'alchemy-sdk';
import NFTCard from './NFTCard';
import NFTDetail from './NFTDetail';
import Modal from '../UI/Modal';

type NFTListProps = {
  ownedNfts: OwnedNft[];
};

const NFTList = ({ ownedNfts }: NFTListProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalNft, setModalNft] = useState<OwnedNft>();

  if (ownedNfts.length === 0) {
    // TODO: style/component
    return <div>No nfts in wallet</div>;
  }

  return (
    <>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {ownedNfts
            .filter(
              (nft) => nft !== undefined && nft.rawMetadata?.name !== undefined
            )
            .map((nft) => (
              <NFTCard
                key={nft.rawMetadata?.name}
                name={nft.rawMetadata?.name}
                image={nft.rawMetadata?.image}
                onClick={() => {
                  setShowModal(true);
                  setModalNft(nft);
                }}
              />
            ))}
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <NFTDetail
          nft={modalNft}
          onClose={() => {
            setShowModal(false);
          }}
        />
      </Modal>
    </>
  );
};

export default NFTList;
