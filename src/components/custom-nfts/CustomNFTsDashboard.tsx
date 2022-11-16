import { useState } from 'react';
import { useAccount } from 'wagmi';
import Head from 'next/head';
import { useQuery } from '@tanstack/react-query';
import UnstakedNFTs from './UnstakedNFTs';
import LoadingSpinner from '../UI/LoadingSpinner';
import { Network, Alchemy } from 'alchemy-sdk';
import { env } from 'process';

const settings = {
  apiKey: env.ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(settings);

const CustomNFTsDashboard = () => {
  const { address, isConnected } = useAccount();

  const {
    isLoading,
    error,
    data: unstakedNFTsData,
    isFetching,
  } = useQuery(
    ['getUnstakedNftsForOwner'],
    () =>
      alchemy.nft.getNftsForOwner(address as string, {
        omitMetadata: false,
        contractAddresses: ['0x9c015E860f62D23F17B9e5E45fd70a765c1b3634'],
      }),
    {
      enabled: !!address,
      refetchOnWindowFocus: false,
    }
  );

  const noWalletFound = () => {
    return (
      <div className="mx-auto w-full max-w-md px-2 py-16 sm:px-0">
        <h3 className="text-center text-sm font-medium leading-5">
          Please connect your wallet.
        </h3>
      </div>
    );
  };

  return (
    <>
      {isConnected && unstakedNFTsData?.ownedNfts ? (
        <div className="mx-auto w-full">
          <UnstakedNFTs
            ownedNfts={unstakedNFTsData?.ownedNfts}
            address={address as string}
          />
        </div>
      ) : (
        noWalletFound()
      )}
    </>
  );
};

export default CustomNFTsDashboard;
