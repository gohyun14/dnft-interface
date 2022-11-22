import { useState } from 'react';
import { useAccount } from 'wagmi';

import UnstakedNFTs from './UnstakedNFTs';
import StakedNFTs from './StakedNFTs';
import MintSection from './MintSection';

const CustomNFTsDashboard = () => {
  const { address, isConnected } = useAccount();

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
      {isConnected ? (
        <div className="mx-auto w-full">
          <MintSection address={address as string} />
          <UnstakedNFTs address={address as string} />
          <StakedNFTs address={address as string} />
        </div>
      ) : (
        noWalletFound()
      )}
    </>
  );
};

export default CustomNFTsDashboard;
