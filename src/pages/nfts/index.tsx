import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import CustomNFTsDashboard from '../../components/custom-nfts/CustomNFTsDashboard';

const CustomNFTsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Custom NFTs</title>
        <meta name="description" content="Wallet View Page" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <CustomNFTsDashboard />
    </>
  );
};

export default CustomNFTsPage;
