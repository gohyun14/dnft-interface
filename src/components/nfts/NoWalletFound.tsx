import { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const NoWalletFound = () => {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState<string>('');

  const handleSearch = () => {
    router.push(`/search/${searchValue}`);
    setSearchValue('');
  };
  return (
    <>
      <Head>
        <title>No Wallet</title>
        <meta name="description" content="No Wallet Found" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="mx-auto mt-28 w-4/5 text-center">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          No Wallet Found
        </h1>
        <p className="mb-6 text-lg font-normal text-gray-500 sm:px-16 lg:text-xl xl:px-48">
          It looks like you entered an invalid wallet address. Check and make
          sure you are using the correct wallet address then try again!
        </p>
        <div className="mx-auto flex w-8/12 items-center rounded-md bg-indigo-100 py-7 px-9">
          <div className="relative mx-auto mr-2 w-full text-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              id="search"
              name="search"
              className="sm:text-md block h-12 w-full rounded-xl border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 text-gray-600 placeholder-gray-400 focus:border-indigo-500 focus:placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Search Wallet Address"
              type="search"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </div>
          <button
            type="button"
            className="inline-flex  items-center rounded-md border border-transparent bg-indigo-600 px-8 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
};

export default NoWalletFound;
