import { useMemo } from 'react';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractRead,
  useBalance,
  chain,
} from 'wagmi';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import CustomNFTList from './CustomNFTList';
import { Network, Alchemy } from 'alchemy-sdk';
import { formatUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_GOERLI,
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(settings);

type StakedNFTsProps = {
  address: string;
};

const StakedNFTs = ({ address }: StakedNFTsProps) => {
  // get staked nfts
  const { isLoading: nftDataLoading, data: stakedNFTsData } = useQuery(
    ['getStakedNftsForOwner'],
    () =>
      alchemy.nft.getNftsForOwner(
        '0x2aA41342f13e47fDFf250be5D0F76C396D4d9ba4',
        {
          omitMetadata: false,
          contractAddresses: ['0x9c015E860f62D23F17B9e5E45fd70a765c1b3634'],
        }
      ),
    {
      enabled: !!address,
      refetchOnWindowFocus: false,
    }
  );

  const { data: contractUserStakedNFTsData } = useContractRead({
    address: '0x2aA41342f13e47fDFf250be5D0F76C396D4d9ba4',
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: '_user',
            type: 'address',
          },
        ],
        name: 'getStakedTokens',
        outputs: [
          {
            internalType: 'uint256[]',
            name: 'tokenIds',
            type: 'uint256[]',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'getStakedTokens',
    args: [address as `0x${string}`],
    watch: true,
  });

  const userStakedNFTs = useMemo(() => {
    const userNFTsInContract = contractUserStakedNFTsData?.map((tokenIdBN) => {
      return tokenIdBN.toNumber();
    });

    return stakedNFTsData?.ownedNfts.filter((nft) => {
      return userNFTsInContract?.includes(parseInt(nft.tokenId));
    });
  }, [contractUserStakedNFTsData, stakedNFTsData]);

  // view GTKN balance
  const { data: dataGTKNBalance } = useBalance({
    addressOrName: address,
    chainId: chain.goerli.id,
    token: '0x9B327229437192AF49Ef1979a71b3452Cec73bc0',
    watch: true,
  });

  // view, update, claim unclaimed rewards
  // view
  const { data: userRewardsData } = useContractRead({
    address: '0x2aA41342f13e47fDFf250be5D0F76C396D4d9ba4',
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: '_user',
            type: 'address',
          },
        ],
        name: 'viewReward',
        outputs: [
          {
            internalType: 'uint256',
            name: 'rewardBalance',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'viewReward',
    args: [address as `0x${string}`],
    watch: true,
  });

  // update
  const { config: configUpdateRewards } = usePrepareContractWrite({
    address: '0x2aA41342f13e47fDFf250be5D0F76C396D4d9ba4',
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: '_user',
            type: 'address',
          },
        ],
        name: 'updateReward',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'updateReward',
    args: [address as `0x${string}`],
  });
  const { data: dataWriteUpdateRewards, write: writeUpdateRewards } =
    useContractWrite(configUpdateRewards); //TODO: add loading spinner minting state

  // claim
  const { config: configClaimRewards } = usePrepareContractWrite({
    address: '0x2aA41342f13e47fDFf250be5D0F76C396D4d9ba4',
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: '_user',
            type: 'address',
          },
        ],
        name: 'claimReward',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'claimReward',
    args: [address as `0x${string}`],
    enabled: userRewardsData?.gt(BigNumber.from(0)),
  });
  const { data: dataWriteClaimRewards, write: writeClaimRewards } =
    useContractWrite(configClaimRewards); //TODO: add loading spinner minting state
  // const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } =
  //   useWaitForTransaction({
  //     hash: writeData?.hash,
  //     onSuccess() {
  //       queryClient.invalidateQueries({
  //         queryKey: ['getStakedNftsForOwner'],
  //       });
  //     },
  //   });

  return (
    <>
      <CustomNFTList
        ownedNfts={userStakedNFTs}
        emptyMessage="No NFTs found"
        title="Your Staked NFTs"
        description="View and unstake your staked NFTs, or view, update, and claim your GTKN rewards"
        staked={true}
        isApprovedForAll={true}
      />
      <section className="mb-8 text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Unclaimed Rewards:{' '}
          {userRewardsData ? parseInt(formatUnits(userRewardsData, 18)) : '0'}{' '}
          GTKN
        </h2>
        <h2 className="text-lg font-semibold text-gray-800">
          You Wallet Balance:{' '}
          {dataGTKNBalance ? parseInt(dataGTKNBalance?.formatted) : '0'} GTKN
        </h2>
        <p className="text-xs font-light text-gray-500">
          GTKN address: 0x9B327229437192AF49Ef1979a71b3452Cec73bc0
        </p>
        <div className="mt-3 flex flex-row justify-center gap-x-4">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-5 py-3 text-sm font-medium text-indigo-700 shadow-sm hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-300 disabled:bg-gray-400 disabled:bg-gray-400"
            disabled={!writeUpdateRewards}
            onClick={() => writeUpdateRewards?.()}
          >
            Update Rewards
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            disabled={
              !writeClaimRewards || !userRewardsData?.gt(BigNumber.from(0))
            }
            onClick={() => writeClaimRewards?.()}
          >
            Claim Rewards
          </button>
        </div>
      </section>
    </>
  );
};

export default StakedNFTs;
