import React from 'react';
import {
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';

import LoadingSpinner from '../UI/LoadingSpinner';

type MintSectionProps = {
  address: string;
};

const MintSection = ({ address }: MintSectionProps) => {
  const queryClient = useQueryClient();

  const { config } = usePrepareContractWrite({
    address: '0x9c015E860f62D23F17B9e5E45fd70a765c1b3634',
    abi: [
      {
        inputs: [],
        name: 'safeMint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'safeMint',
  });
  const { data: writeData, write } = useContractWrite(config); //TODO: add loading spinner minting state
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } =
    useWaitForTransaction({
      hash: writeData?.hash,
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['getUnstakedNftsForOwner'],
        });
      },
    });
  return (
    <div className="mx-auto max-w-2xl py-8 px-4 text-center sm:px-6 sm:pt-12 sm:pb-4 lg:max-w-7xl lg:px-8">
      <h1 className="text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl">
        Mint New NFT
      </h1>
      <p className="mx-auto mb-2 max-w-5xl text-center text-lg font-normal text-gray-500">
        Mint one of our custom NFTs straight to your wallet
      </p>
      <button
        type="button"
        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-5 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800 disabled:bg-gray-400"
        disabled={!write}
        onClick={() => write?.()}
      >
        Mint
      </button>
    </div>
  );
};

export default MintSection;
