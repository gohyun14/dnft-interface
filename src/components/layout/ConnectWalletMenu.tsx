import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { WalletIcon } from '@heroicons/react/24/outline';
import { Connector } from 'wagmi';
import { ConnectArgs } from '@wagmi/core';

import MiniLoadingSpinner from '../UI/MiniLoadingSpinner';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type ConnectWalletMenuProps = {
  connect: (args?: Partial<ConnectArgs> | undefined) => void;
  connectors: Connector[];
  isLoading: boolean;
  pendingConnector: Connector | undefined;
};

const ConnectWalletMenu = ({
  connect,
  connectors,
  isLoading,
  pendingConnector,
}: ConnectWalletMenuProps) => {
  return (
    <Menu as="div" className="relative ml-4 flex-shrink-0">
      <div>
        <Menu.Button className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-normal text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800">
          Connect{' '}
          <WalletIcon
            className="ml-1 h-[1.15rem] w-[1.15rem]"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {connectors.map((connector) => (
            <Menu.Item key={connector.id}>
              {({ active }) => (
                <button
                  className={classNames(
                    active ? 'bg-gray-100' : '',
                    'block w-full px-4 py-2 text-left text-sm text-gray-700'
                  )}
                  disabled={!connector.ready}
                  onClick={() => connect({ connector })}
                >
                  {connector.name}
                  {!connector.ready && ' (unsupported)'}
                  {isLoading &&
                    connector.id === pendingConnector?.id &&
                    ' (connecting)'}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ConnectWalletMenu;
