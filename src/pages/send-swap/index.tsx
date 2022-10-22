import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import SendSwapTabs from '../../components/send-swap/SendSwapTabs';

const SendSwapPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Send/Swap</title>
        <meta name="description" content="Wallet View Page" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div>
        Send Swap Page
        <SendSwapTabs />
      </div>
    </>
  );
};

export default SendSwapPage;
