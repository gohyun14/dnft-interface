import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  PhotoIcon,
  ArrowsUpDownIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Home page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto mt-8 flex flex-col items-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          The <span className="text-indigo-300">Crypto</span> App
        </h1>
        <p className="text-2xl text-gray-700">What you can do</p>
        <div className="mt-3 grid gap-4 pt-3 text-center md:grid-cols-2 lg:w-2/3">
          <TechnologyCard
            name="Search"
            description="Search for a wallet address to explore all of their NFTs"
            link="/search"
            Icon={MagnifyingGlassIcon}
          />
          <TechnologyCard
            name="Mint NFT"
            description="Mint a special, custom NFT to collect or stake in the app"
            link="/nfts"
            Icon={PhotoIcon}
          />
          <TechnologyCard
            name="Stake NFT"
            description="Stake your NFT to receive rewards paid every minute"
            link="/nfts"
            Icon={CurrencyDollarIcon}
          />
          <TechnologyCard
            name="Send/Swap"
            description="Send tokens to another address, or swap them using Uniswap"
            link="/send-swap"
            Icon={ArrowsUpDownIcon}
            rotate
          />
        </div>
        <p className="mt-8 max-w-xl text-center text-xl text-gray-500 lg:mt-12 lg:max-w-3xl xl:max-w-5xl">
          Searching is done on Ethereum Mainnet. NFT minting/staking and token
          sending/swapping are done on Goerli Testnet. If you need Goerli Eth to
          transact check out the{' '}
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
      </main>
    </>
  );
};

export default Home;

type TechnologyCardProps = {
  name: string;
  description: string;
  link: string;
  Icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
  rotate?: boolean;
};

const TechnologyCard = ({
  name,
  description,
  link,
  Icon,
  rotate,
}: TechnologyCardProps) => {
  return (
    <Link href={link}>
      <a className="flex flex-col justify-center rounded border-2 border-gray-500 p-6 shadow-xl duration-500 motion-safe:hover:scale-105">
        <h2 className="text-lg text-gray-700">{name}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        <Icon
          className={`mx-auto mt-2 h-8 w-8 text-indigo-300 ${
            rotate && ' -rotate-90'
          }`}
          aria-hidden="true"
        />
      </a>
    </Link>
  );
};
