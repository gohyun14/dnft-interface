import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { MagnifyingGlassIcon, PhotoIcon } from '@heroicons/react/24/outline';

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
          The <span className="text-indigo-300">(D)NFT</span> App
        </h1>
        <p className="text-2xl text-gray-700">What you can do:</p>
        <div className="mt-3 grid gap-4 pt-3 text-center md:grid-cols-2 lg:w-2/3">
          <TechnologyCard
            name="Search"
            description="Search for a wallet address to explore all of their NFTs"
            link="/search"
            icon="search"
          />
          <TechnologyCard
            name="DNFT"
            description="Mint, stake, upgrade, and view our custom dynamic NFTs"
            link="/dnfts"
            icon="photo"
          />
        </div>
      </main>
    </>
  );
};

export default Home;

type TechnologyCardProps = {
  name: string;
  description: string;
  link: string;
  icon: string;
};

const TechnologyCard = ({
  name,
  description,
  link,
  icon,
}: TechnologyCardProps) => {
  return (
    <Link href={link}>
      <a className="flex flex-col justify-center rounded border-2 border-gray-500 p-6 shadow-xl duration-500 motion-safe:hover:scale-105">
        <h2 className="text-lg text-gray-700">{name}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        {icon === 'photo' ? (
          <PhotoIcon
            className="mx-auto mt-2 h-8 w-8 text-indigo-300"
            aria-hidden="true"
          />
        ) : (
          <MagnifyingGlassIcon
            className="mx-auto mt-2 h-8 w-8 text-indigo-300"
            aria-hidden="true"
          />
        )}
      </a>
    </Link>
  );
};
