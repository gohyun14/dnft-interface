import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { useAccount } from 'wagmi';

// import SendTab from './SendTab';
// import SwapTab from './SwapTab';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const DNFTTabs = () => {
  const { isConnected } = useAccount();

  const noWalletFound = (action: string) => {
    return (
      <h3 className="text-center text-sm font-medium leading-5">
        Please connect your wallet to {action}.
      </h3>
    );
  };

  return (
    <div className="mx-auto w-full max-w-md px-2 py-16 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-indigo-100 p-1">
          <Tab
            key="send"
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-indigo-700',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow'
                  : 'text-indigo-500 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Send
          </Tab>
          <Tab
            key="swap"
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-indigo-700',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow'
                  : 'text-indigo-500 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Swap
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel
            key="send"
            className={classNames('rounded-xl bg-white p-3')}
          >
            {isConnected ? 'Tab1' : noWalletFound('send')}
          </Tab.Panel>
          <Tab.Panel
            key="swap"
            className={classNames(
              'rounded-xl bg-white p-3',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            {isConnected ? 'Tab2' : noWalletFound('swap')}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default DNFTTabs;
