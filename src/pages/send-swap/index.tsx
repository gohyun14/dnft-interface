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
      <div className="mx-auto mt-9 w-4/5">
        <h1 className="mb-1 text-center text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl">
          Send/Swap Tokens
        </h1>
        <p className="lg:text-l mx-auto w-4/5 text-center text-lg font-normal text-gray-500 sm:px-16 xl:px-48">
          Send tokens to another address, or swap from one token to another
          using Uniswap!
        </p>
        <SendSwapTabs />
      </div>
    </>
  );
};

export default SendSwapPage;
