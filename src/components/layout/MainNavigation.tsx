import { useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { UserIcon, Bars3Icon, XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { chain, useConnect, useAccount, useDisconnect } from 'wagmi';

import ConnectWalletMenu from './ConnectWalletMenu';
import WalletConnectedMenu from './WalletConnectedMenu';

const MainNavigation = () => {
  const router = useRouter();
  const activeLink = router.pathname;

  const { connect, connectors, error, pendingConnector, isLoading } =
    useConnect({
      chainId: chain.goerli.id,
    });
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  useEffect(() => setIsWalletConnected(isConnected), [isConnected]);

  return (
    <Disclosure as="nav" className="sticky top-0 z-50 bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex px-2 lg:px-0">
                <div className="flex flex-shrink-0 items-center">
                  {/* <img
                    className="block lg:hidden h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                    alt="Workflow"
                  />
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
                    alt="Workflow"
                  /> */}
                </div>
                <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  <Link href="/">
                    <a
                      className={
                        activeLink === '/'
                          ? 'inline-flex items-center  border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900'
                          : 'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }
                    >
                      Home
                    </a>
                  </Link>
                  <Link href="/nfts">
                    <a
                      className={
                        activeLink === '/nfts'
                          ? 'inline-flex items-center  border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900'
                          : 'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }
                    >
                      Custom NFTs
                    </a>
                  </Link>
                  <Link href="/send-swap">
                    <a
                      className={
                        activeLink === '/send-swap'
                          ? 'inline-flex items-center  border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900'
                          : 'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }
                    >
                      Send/Swap
                    </a>
                  </Link>
                </div>
              </div>
              <div className="flex items-center lg:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XCircleIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="hidden lg:ml-8 lg:flex lg:items-center">
                {/* Profile dropdown */}
                {isWalletConnected ? (
                  <WalletConnectedMenu
                    disconnect={disconnect}
                    address={address}
                  />
                ) : (
                  <ConnectWalletMenu
                    connect={connect}
                    connectors={connectors}
                    isLoading={isLoading}
                    pendingConnector={pendingConnector}
                  />
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800" */}
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
              >
                Home
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
              >
                Mint Dynamic NFTs
              </Disclosure.Button>
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <UserIcon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    Tom Cook
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    tom@example.com
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  Your Profile
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  Settings
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  Sign out
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default MainNavigation;
