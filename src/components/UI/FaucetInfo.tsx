import { Popover, Transition } from '@headlessui/react';
import { InformationCircleIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'react';
import Link from 'next/link';

const FaucetInfo = () => {
  return (
    <div className="mx-auto w-full max-w-sm px-4 text-center">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? '' : 'text-opacity-90'}
                inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              <span>Need Goerli Eth to transact?</span>
              <InformationCircleIcon
                className={`${open ? '' : 'text-opacity-70'}
                  ml-1 h-7 w-7 text-indigo-300 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-4 sm:px-0">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <p className="p-4 text-center text-sm font-normal text-gray-700">
                    Token sending/swapping is done on Goerli Testnet. If you
                    need Goerli Eth to transact check out the{' '}
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
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

export default FaucetInfo;
