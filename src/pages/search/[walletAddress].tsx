import React from 'react';
import { NextPage } from 'next';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
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
  const { isLoading, error, data, isFetching } = useQuery(
    ['getNftsForOwner'],
    () => alchemy.nft.getNftsForOwner('0xshah.eth', { omitMetadata: false })
  );

  if (isLoading) return <LoadingSpinner />;

  if (error) return <p>An error has occurred</p>;

  if (data?.ownedNfts) {
    return <NFTList ownedNfts={data?.ownedNfts} />;
  }

  return <p>Hmm</p>; // TODO: invalid address page
};

export default WalletNFTPage;
