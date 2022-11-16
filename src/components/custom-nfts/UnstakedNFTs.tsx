import React from 'react';
import { OwnedNft } from 'alchemy-sdk';
import {
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import CustomNFTList from './CustomNFTList';

type UnstakedNFTsProps = {
  ownedNfts: OwnedNft[];
  address: string;
};

const UnstakedNFTs = ({ ownedNfts, address }: UnstakedNFTsProps) => {
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
  const {
    data: writeData,
    isLoading: isWriteLoading,
    isSuccess: isWriteSuccess,
    write,
  } = useContractWrite(config); //TODO: add loading spinner minting state
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: writeData?.hash,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['getUnstakedNftsForOwner'] });
    },
  });

  return (
    <>
      <CustomNFTList
        ownedNfts={ownedNfts}
        emptyMessage="No NFTs found"
        title="Your Unstaked NFTs"
      />
      <section className="text-center">
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800 disabled:bg-gray-400"
          disabled={!write}
          onClick={() => write?.()}
        >
          Mint New NFT
        </button>
      </section>
    </>
  );
};

export default UnstakedNFTs;
