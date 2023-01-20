import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Head from 'next/head';
import NFTList from '../../components/nfts/NFTList';

const WalletNFTPage: NextPage = () => {
  const router = useRouter();
  const walletAddress = router.query.walletAddress;
  console.log(walletAddress);

  return (
    <>
      <Head>
        <title>Wallet</title>
        <meta name="description" content="Wallet View Page" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NFTList address={walletAddress as string | undefined} />
    </>
  );

  return <p>Hmm</p>; // TODO: invalid address page
};

export default WalletNFTPage;
