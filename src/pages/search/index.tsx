import React from 'react';
import { NextPage } from 'next';

const SearchPage: NextPage = () => {
  return (
    <div className="mx-auto mt-28 w-4/5 text-center">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
        Search Any Wallet's NFTs
      </h1>
      <p className="mb-6 text-lg font-normal text-gray-500 sm:px-16 lg:text-xl xl:px-48">
        Search up any valid wallet address, and you can see all of the NFTs they
        hold! Click on an NFT to see more specific information such as the NFT's
        description and traits!
      </p>
      <section></section>
    </div>
  );
};

export default SearchPage;
