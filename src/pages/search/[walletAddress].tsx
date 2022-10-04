import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useQuery } from '@tanstack/react-query';
import NFTList from '../../components/nfts/NFTList';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { Network, Alchemy } from 'alchemy-sdk';
import { env } from 'process';

const settings = {
  apiKey: env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

const WalletNFTPage: NextPage = () => {
  const router = useRouter();
  const walletAddress = router.query.walletAddress as string;
  console.log(walletAddress);

  const { isLoading, error, data, isFetching, refetch } = useQuery(
    ['getNftsForOwner'],
    () => alchemy.nft.getNftsForOwner(walletAddress, { omitMetadata: false }),
    {
      enabled: !!walletAddress,
    }
  );

  useEffect(() => {
    refetch();
  }, [walletAddress, refetch]);

  if (isLoading || isFetching) return <LoadingSpinner />;

  if (error) {
    console.log(error);
    return <p>{(error as Error).message}</p>;
  }

  if (data?.ownedNfts) {
    return <NFTList ownedNfts={data?.ownedNfts} />;
  }

  return <p>Hmm</p>; // TODO: invalid address page
};

export default WalletNFTPage;
