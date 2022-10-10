import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Head from 'next/head';
import { useQuery } from '@tanstack/react-query';
import NFTList from '../../components/nfts/NFTList';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import NoWalletFound from '../../components/nfts/NoWalletFound';
import { Network, Alchemy } from 'alchemy-sdk';
import { env } from 'process';

const settings = {
  apiKey: env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

const WalletNFTPage: NextPage = () => {
  const router = useRouter();
  const walletAddress = router.query.walletAddress;
  console.log(walletAddress);

  const { isLoading, error, data, isFetching, refetch } = useQuery(
    ['getNftsForOwner'],
    () =>
      alchemy.nft.getNftsForOwner(walletAddress as string, {
        omitMetadata: false,
      }),
    {
      enabled: !!walletAddress,
    }
  );

  useEffect(() => {
    refetch();
  }, [walletAddress, refetch]);

  if (isLoading || (isLoading && isFetching)) return <LoadingSpinner />;

  if (error) {
    console.log(error);
    return (
      <>
        {/* <p>{(error as Error).message}</p>; */}
        <NoWalletFound />
      </>
    );
  }

  console.log(walletAddress);

  if (data?.ownedNfts) {
    return (
      <>
        <Head>
          <title>Wallet</title>
          <meta name="description" content="Wallet View Page" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <NFTList ownedNfts={data?.ownedNfts} />
      </>
    );
  }

  return <p>Hmm</p>; // TODO: invalid address page
};

export default WalletNFTPage;
