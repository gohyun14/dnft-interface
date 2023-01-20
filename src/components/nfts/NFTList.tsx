import { useState, useEffect } from 'react';
import { OwnedNft } from 'alchemy-sdk';
import { useQuery } from '@tanstack/react-query';
import NFTCard from './NFTCard';
import NFTDetail from './NFTDetail';
import Modal from '../UI/Modal';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import NoWalletFound from '../../components/nfts/NoWalletFound';
import { Network, Alchemy } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_MAINNET,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

type NFTListProps = {
  address: string | undefined;
};

const NFTList = ({ address }: NFTListProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalNft, setModalNft] = useState<OwnedNft>();
  const { isLoading, error, data, isFetching, refetch } = useQuery(
    ['getNftsForOwner'],
    () =>
      alchemy.nft.getNftsForOwner(address as string, {
        omitMetadata: false,
      }),
    {
      enabled: !!address,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    refetch();
  }, [address, refetch]);

  if (isLoading || isFetching) return <LoadingSpinner />;

  if (error) {
    console.log(error);
    return (
      <>
        {/* <p>{(error as Error).message}</p>; */}
        <NoWalletFound />
      </>
    );
  }

  if (data?.ownedNfts.length === 0) {
    // TODO: style/component
    return <div>No nfts in wallet</div>;
  }

  return (
    <>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data?.ownedNfts
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
