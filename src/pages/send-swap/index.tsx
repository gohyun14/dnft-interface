import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
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
        <p className="mx-auto max-w-5xl text-center text-lg font-normal text-gray-500">
          Send tokens to another address, or swap from one token to another
          using Uniswap!
        </p>
        <SendSwapTabs />
        <p className="mx-auto mt-4 max-w-xl text-center text-sm font-normal text-gray-700">
          Token sending/swapping is done on Goerli Testnet. If you need Goerli
          Eth to transact check out the{' '}
          <Link href="https://goerlifaucet.com/">
            <a
              target="_blank"
              className="font-semibold text-indigo-500 hover:underline"
            >
              Alchemy Goerli Faucet
            </a>
          </Link>
          {' or the '}
          <Link href="https://faucet.paradigm.xyz/">
            <a
              target="_blank"
              className="font-semibold text-indigo-500 hover:underline"
            >
              Paradigm Goerli Faucet
            </a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default SendSwapPage;
