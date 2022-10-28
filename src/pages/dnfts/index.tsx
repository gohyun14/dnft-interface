import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import DNFTTabs from '../../components/send-swap/SendSwapTabs';

const DNFTsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>DNFTs</title>
        <meta name="description" content="Wallet View Page" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div>
        DNFTsPage
        {/* <DNFTTabs /> */}
      </div>
    </>
  );
};

export default DNFTsPage;
