import { Fragment } from 'react';
import Link from 'next/link';
import { Popover, Menu, Transition } from '@headlessui/react';
import { UserIcon } from '@heroicons/react/24/outline';
import { UserIcon as UserIconSolid } from '@heroicons/react/24/solid';
import { useEnsAvatar, useEnsName } from 'wagmi';

type WalletConnectedMenuProps = {
  disconnect: () => void;
  address: `0x${string}` | undefined;
};

const WalletConnectedMenu = ({
  disconnect,
  address,
}: WalletConnectedMenuProps) => {
  // const { data: ensAvatar } = useEnsAvatar({ addressOrName: address });
  // const { data: ensName } = useEnsName({ address });

  return (
    <Popover className="relative">
      {({ close }) => (
        <>
          <Popover.Button className="flex items-center gap-1 rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-normal text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800">
            {/* {ensAvatar ? (
              <img src={ensAvatar} alt="ENS Avatar" />
            ) : (
              <UserIcon className="h-5 w-5" aria-hidden="true" />
            )}
            <div>{ensName ? ensName : `${address?.slice(0, 7)}...`}</div> */}
            <UserIcon className="h-5 w-5" aria-hidden="true" />
            <div>{`${address?.slice(0, 7)}...`}</div>
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
            <Popover.Panel className="absolute right-[-13rem] z-10 mt-3 w-96 -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="flex flex-col items-center bg-indigo-50 p-4">
                  <div className="mb-2 h-min w-min rounded-full border border-gray-900 p-2">
                    <UserIconSolid
                      className="h-10 w-10 text-gray-900"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-sm font-normal text-gray-900">
                    {/* {ensName ? ensName : address} */}
                    {address}
                  </span>
                </div>
                <div className="relative bg-white p-7">
                  <Link href={`/search/${address}`}>
                    <a
                      className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      onClick={close}
                    >
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          Your Wallet
                        </p>
                        <p className="text-sm text-gray-500">
                          See all NFTs in your wallet
                        </p>
                      </div>
                    </a>
                  </Link>
                </div>
                <div className="relative bg-white p-7">
                  <div
                    className="-m-3 flex cursor-pointer items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    onClick={() => {
                      disconnect();
                      close();
                    }}
                  >
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        Disconnect
                      </p>
                      <p className="text-sm text-gray-500">
                        Disconnect your wallet
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
    // <Menu as="div" className="relative ml-4 flex-shrink-0">
    //   <div>
    //     <Menu.Button className="flex items-center gap-1 rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-normal text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800">
    //       {ensAvatar ? (
    //         <img src={ensAvatar} alt="ENS Avatar" />
    //       ) : (
    //         <UserIcon className="h-5 w-5" aria-hidden="true" />
    //       )}
    //       <div>{ensName ? ensName : `${address?.slice(0, 7)}...`}</div>
    //     </Menu.Button>
    //   </div>
    //   <Transition
    //     as={Fragment}
    //     enter="transition ease-out duration-100"
    //     enterFrom="transform opacity-0 scale-95"
    //     enterTo="transform opacity-100 scale-100"
    //     leave="transition ease-in duration-75"
    //     leaveFrom="transform opacity-100 scale-100"
    //     leaveTo="transform opacity-0 scale-95"
    //   >
    //     <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
    //       <Link href={`/search/${address}`}>
    //         <Menu.Item>
    //           {({ active }) => (
    //             <a
    //               className={classNames(
    //                 active ? 'bg-gray-100' : '',
    //                 'block px-4 py-2 text-sm text-gray-700'
    //               )}
    //             >
    //               Your Profile
    //             </a>
    //           )}
    //         </Menu.Item>
    //       </Link>
    //       <Menu.Item>
    //         {({ active }) => (
    //           <a
    //             href="#"
    //             className={classNames(
    //               active ? 'bg-gray-100' : '',
    //               'block px-4 py-2 text-sm text-gray-700'
    //             )}
    //           >
    //             Settings
    //           </a>
    //         )}
    //       </Menu.Item>
    //       <Menu.Item>
    //         {({ active }) => (
    //           <button
    //             className={classNames(
    //               active ? 'bg-gray-100' : '',
    //               'block w-full px-4 py-2 text-left text-sm text-gray-700'
    //             )}
    //             onClick={disconnect}
    //           >
    //             Disconnect
    //           </button>
    //         )}
    //       </Menu.Item>
    //     </Menu.Items>
    //   </Transition>
    // </Menu>
  );
};

export default WalletConnectedMenu;
