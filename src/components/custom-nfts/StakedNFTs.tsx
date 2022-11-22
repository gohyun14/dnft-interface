import { useMemo } from 'react';
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

type StakedNFTsProps = {
  address: string;
};

const StakedNFTs = ({ address }: StakedNFTsProps) => {
  const queryClient = useQueryClient();

  const { isLoading: nftDataLoading, data: stakedNFTsData } = useQuery(
    ['getStakedNftsForOwner'],
    () =>
      alchemy.nft.getNftsForOwner(
        '0x2fCaB0b8939cb07eDCc2F398E12292856787BD4B',
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

  const { data: contractNFTsData } = useContractRead({
    address: '0x2fCaB0b8939cb07eDCc2F398E12292856787BD4B',
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
    const userNFTsInContract = contractNFTsData?.map((tokenIdBN) => {
      return tokenIdBN.toNumber();
    });

    return stakedNFTsData?.ownedNfts.filter((nft) => {
      return userNFTsInContract?.includes(parseInt(nft.tokenId));
    });
  }, [contractNFTsData, stakedNFTsData]);

  // const { config } = usePrepareContractWrite({
  //   address: '0x9c015E860f62D23F17B9e5E45fd70a765c1b3634',
  //   abi: [
  //     {
  //       inputs: [],
  //       name: 'safeMint',
  //       outputs: [],
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //   ],
  //   functionName: 'safeMint',
  // });
  // const { data: writeData, write } = useContractWrite(config); //TODO: add loading spinner minting state
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
        title="Your Unstaked NFTs"
        description="View your unstaked NFTs, and stake them to receive GTKN rewards"
      />
      <section className="text-center">
        {/* <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800 disabled:bg-gray-400"
          disabled={!write}
          onClick={() => write?.()}
        >
          Mint New NFT
        </button> */}
      </section>
    </>
  );
};

export default StakedNFTs;
