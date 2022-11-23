import { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { IKImage } from 'imagekitio-react';
import { TokenUri } from 'alchemy-sdk';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractRead,
} from 'wagmi';
import { BigNumber } from 'ethers';

interface CustomNFTCardProps {
  uri: TokenUri | undefined;
  tokenId: string;
  staked: boolean;
  isApprovedForAll: boolean;
}

const CustomNFTCard = ({
  uri,
  tokenId,
  staked,
  isApprovedForAll,
}: CustomNFTCardProps) => {
  const queryClient = useQueryClient();

  const [imageLoading, setImageLoading] = useState<boolean>(true);

  const urlEndpoint = 'https://ik.imagekit.io/thbgrljbi/';

  const ipfsRaw = uri?.raw.split('//')[1]?.split('/');
  const ipfsWeblink = ipfsRaw
    ? `https://${ipfsRaw[0]}.ipfs.dweb.link/${ipfsRaw[1]}`
    : undefined;

  const { isLoading, error, data, isFetching } = useQuery(['nftMetadata'], () =>
    axios.get(ipfsWeblink as string).then((res) => res.data)
  );

  const imageRaw = data?.image.split('//')[1]?.split('/');
  const imageWebLink = data
    ? `https://${imageRaw[0]}.ipfs.dweb.link/${imageRaw[1]}`
    : undefined;

  // nft staking
  const { config: stakeNFTConfig, error: stakePrepareError } =
    usePrepareContractWrite({
      address: '0x2aA41342f13e47fDFf250be5D0F76C396D4d9ba4',
      abi: [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'stake',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: 'stake',
      args: [BigNumber.from(tokenId)],
      enabled: !staked && isApprovedForAll,
    });

  const { data: stakeWriteData, write: stakeWrite } =
    useContractWrite(stakeNFTConfig); //TODO: add loading spinner minting state

  const {
    isLoading: isStakeTransactionLoading,
    isSuccess: isStakeTransactionSuccess,
  } = useWaitForTransaction({
    hash: stakeWriteData?.hash,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['getUnstakedNftsForOwner'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getStakedNftsForOwner'],
      });
    },
  });

  // nft unstaking
  const { config: unstakeNFTConfig, error: unstakePrepareError } =
    usePrepareContractWrite({
      address: '0x2aA41342f13e47fDFf250be5D0F76C396D4d9ba4',
      abi: [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_tokenId',
              type: 'uint256',
            },
          ],
          name: 'unstake',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: 'unstake',
      args: [BigNumber.from(tokenId)],
      enabled: staked,
    });

  const { data: unstakeWriteData, write: unstakeWrite } =
    useContractWrite(unstakeNFTConfig); //TODO: add loading spinner minting state

  const {
    isLoading: isUnstakeTransactionLoading,
    isSuccess: isUnstakeTransactionSuccess,
  } = useWaitForTransaction({
    hash: unstakeWriteData?.hash,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['getUnstakedNftsForOwner'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getStakedNftsForOwner'],
      });
    },
  });

  return (
    <div className="group relative mx-4 mt-4 rounded-md shadow-md duration-200 motion-safe:hover:scale-[1.01]">
      <div className="h-48 w-44 overflow-hidden rounded-md">
        {imageLoading && (
          <div className=" mx-auto h-full w-full animate-pulse bg-gray-400">
            &nbsp;
          </div>
        )}
        <IKImage
          urlEndpoint={urlEndpoint}
          src={imageWebLink !== undefined ? imageWebLink : ''}
          alt={data?.name}
          className="h-full w-full object-cover object-center"
          onLoad={() => {
            setImageLoading(false);
          }}
        />
      </div>
      <div className="rounded-md bg-white pb-2 text-center">
        <section className="mb-1 bg-white text-center font-semibold text-gray-800">
          #{tokenId}
        </section>
        {(isApprovedForAll || unstakeWrite) && (
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            disabled={
              staked
                ? !unstakeWrite || unstakePrepareError !== null
                : !stakeWrite || stakePrepareError !== null
            }
            onClick={() => (staked ? unstakeWrite?.() : stakeWrite?.())}
          >
            {staked ? 'Unstake' : 'Stake'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomNFTCard;
