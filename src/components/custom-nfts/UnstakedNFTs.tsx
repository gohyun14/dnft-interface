import React from 'react';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractRead,
} from 'wagmi';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import CustomNFTList from './CustomNFTList';
import { Network, Alchemy } from 'alchemy-sdk';
import { env } from 'process';

const settings = {
  apiKey: env.ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(settings);

type UnstakedNFTsProps = {
  address: string;
};

const UnstakedNFTs = ({ address }: UnstakedNFTsProps) => {
  const queryClient = useQueryClient();

  const { isLoading: nftDataLoading, data: unstakedNFTsData } = useQuery(
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

  const { data: isApprovedForAll } = useContractRead({
    address: '0x9c015E860f62D23F17B9e5E45fd70a765c1b3634',
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
        ],
        name: 'isApprovedForAll',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'isApprovedForAll',
    args: [
      address as `0x${string}`,
      '0x2fCaB0b8939cb07eDCc2F398E12292856787BD4B',
    ],
    watch: true,
  });

  const { config } = usePrepareContractWrite({
    address: '0x9c015E860f62D23F17B9e5E45fd70a765c1b3634',
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'approved',
            type: 'bool',
          },
        ],
        name: 'setApprovalForAll',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'setApprovalForAll',
    args: [
      '0x2fCaB0b8939cb07eDCc2F398E12292856787BD4B',
      isApprovedForAll ? false : true,
    ],
  });
  const { data: approvalWriteData, write: approvalWrite } =
    useContractWrite(config); //TODO: add loading spinner minting state
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } =
    useWaitForTransaction({
      hash: approvalWriteData?.hash,
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['getUnstakedNftsForOwner', 'getStakedNftsForOwner'],
        });
      },
    });

  return (
    <>
      <CustomNFTList
        ownedNfts={unstakedNFTsData?.ownedNfts}
        emptyMessage="No NFTs found"
        title="Your Unstaked NFTs"
        description="View your unstaked NFTs, approve/unapprove them for staking , and stake them to receive GTKN rewards"
        buttonDisabled={!isApprovedForAll}
      />
      <section className="text-center">
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800 disabled:bg-gray-400"
          disabled={!approvalWrite}
          onClick={() => approvalWrite?.()}
        >
          {isApprovedForAll ? 'Unapprove' : 'Approve'} NTFs for Staking
        </button>
      </section>
    </>
  );
};

export default UnstakedNFTs;
