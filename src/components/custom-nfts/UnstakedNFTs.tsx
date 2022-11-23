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

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_GOERLI,
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(settings);

type UnstakedNFTsProps = {
  address: string;
};

const UnstakedNFTs = ({ address }: UnstakedNFTsProps) => {
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

  // check and write nft approval
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
      '0x2aA41342f13e47fDFf250be5D0F76C396D4d9ba4',
    ],
    watch: true,
  });

  const { config: approvalConfig } = usePrepareContractWrite({
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
      '0x2aA41342f13e47fDFf250be5D0F76C396D4d9ba4',
      isApprovedForAll ? false : true,
    ],
  });
  const { data: approvalWriteData, write: approvalWrite } =
    useContractWrite(approvalConfig); //TODO: add loading spinner minting state

  return (
    <>
      <CustomNFTList
        ownedNfts={unstakedNFTsData?.ownedNfts}
        emptyMessage="No NFTs found"
        title="Your Unstaked NFTs"
        description="View your unstaked NFTs, approve/unapprove them for staking, and stake them to receive GTKN rewards"
        staked={false}
        isApprovedForAll={
          isApprovedForAll !== undefined ? isApprovedForAll : false
        }
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
