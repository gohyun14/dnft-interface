import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import SendSwapTabs from '../../components/send-swap/SendSwapTabs';
import FaucetInfo from '../../components/UI/FaucetInfo';

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
          Send and Swap
        </h1>
        <p className="mx-auto max-w-5xl text-center text-lg font-normal text-gray-500">
          Send tokens to another address, and swap from one token to another!
        </p>
        <SendSwapTabs />
        <FaucetInfo />
      </div>
    </>
  );
};

export default SendSwapPage;
