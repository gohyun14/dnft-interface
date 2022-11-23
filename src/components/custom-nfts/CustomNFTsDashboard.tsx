import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

import UnstakedNFTs from './UnstakedNFTs';
import StakedNFTs from './StakedNFTs';
import MintSection from './MintSection';
import FaucetInfo from '../../components/UI/FaucetInfo';

const CustomNFTsDashboard = () => {
  const { isConnected, address } = useAccount();

  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  useEffect(() => setIsWalletConnected(isConnected), [isConnected]);

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
      {isWalletConnected ? (
        <div className="mx-auto w-full">
          <MintSection address={address as string} />
          <UnstakedNFTs address={address as string} />
          <StakedNFTs address={address as string} />
          <div className="mt-28 mb-28">
            <FaucetInfo />
          </div>
        </div>
      ) : (
        noWalletFound()
      )}
    </>
  );
};

export default CustomNFTsDashboard;
