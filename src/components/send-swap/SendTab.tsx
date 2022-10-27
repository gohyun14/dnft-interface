import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import {
  erc20ABI,
  chain,
  usePrepareSendTransaction,
  useSendTransaction,
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

import SelectControlled from '../UI/SelectControlled';
import InputControlled from '../UI/InputControlled';
import { parseEther, parseUnits } from 'ethers/lib/utils';

export type tokenOption = {
  id: number;
  symbol: string;
  name: string;
  tokenAddress?: `0x${string}`;
  decimals?: number;
};

export const tokens: tokenOption[] = [
  { id: 1, symbol: 'ETH', name: 'Ether' },
  {
    id: 2,
    symbol: 'WETH',
    name: 'Wrapped Ether',
    tokenAddress: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    decimals: 18,
  },
  {
    id: 3,
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    tokenAddress: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
    decimals: 18,
  },
  {
    id: 4,
    name: 'ChainLink Token',
    symbol: 'LINK',
    tokenAddress: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    decimals: 18,
  },
  {
    id: 5,
    name: 'Uniswap',
    symbol: 'UNI',
    tokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    decimals: 18,
  },
];

type SendTabProps = {
  address?: `0x${string}`;
};

// 0x219723D005E383032ea9Ae43e4A72BdeAd0FA38b

const SendTab = ({ address }: SendTabProps) => {
  const [selectedToken, setSelectedToken] = useState(tokens[0]);

  // verify recipient address
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [debouncedRecipientAddress] = useDebounce(recipientAddress, 1000);
  const [recipAddressInvalid, setRecipAddressInvalid] =
    useState<boolean>(false);

  const { isLoading: isRecipBalanceLoading } = useBalance({
    addressOrName: debouncedRecipientAddress,
    chainId: chain.goerli.id,
    watch: true,
    onError() {
      setRecipAddressInvalid(true);
    },
    onSuccess() {
      setRecipAddressInvalid(false);
    },
  });

  // verify user balance
  const [amount, setAmount] = useState<string>('');
  const [debouncedAmount] = useDebounce(amount, 1000);
  const [userBalanceInvalid, setUserBalanceInvalid] = useState<boolean>(false);

  const { data: userBalanceData, isLoading: isUserBalanceLoading } = useBalance(
    {
      addressOrName: address,
      chainId: chain.goerli.id,
      token: selectedToken?.tokenAddress,
      watch: true,
    }
  );

  useEffect(() => {
    if (userBalanceData) {
      setUserBalanceInvalid(
        parseFloat(userBalanceData.formatted) < parseFloat(debouncedAmount)
      );
    }
  }, [debouncedAmount, userBalanceData]);

  // prepare eth transaction
  const { config: sendEthConfig } = usePrepareSendTransaction({
    request: {
      to: debouncedRecipientAddress,
      value: debouncedAmount ? parseEther(debouncedAmount) : undefined,
    },
    enabled: selectedToken?.symbol === 'ETH',
  });

  const {
    data: sendEthTransactionData,
    sendTransaction: sendEthTransaction,
    isLoading: isLoadingETHTransaction,
  } = useSendTransaction({
    ...sendEthConfig,
    onSuccess() {
      setRecipientAddress('');
      setAmount('');
    },
  });

  // prepare erc20 transaction
  const { config: sendERC20Config } = usePrepareContractWrite({
    address: selectedToken?.tokenAddress,
    abi: erc20ABI,
    functionName: 'transfer',
    args: [
      debouncedRecipientAddress as `0x${string}`,
      debouncedAmount !== ''
        ? parseUnits(debouncedAmount, 18)
        : parseUnits('0', 18),
    ],
    enabled: selectedToken?.symbol !== 'ETH' && debouncedAmount !== '',
  });

  const {
    data: sendERC20TransactionData,
    write: writeERC20Transaction,
    isLoading: isLoadingERC20Transaction,
  } = useContractWrite({
    ...sendERC20Config,
    onSuccess() {
      setRecipientAddress('');
      setAmount('');
    },
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash:
      selectedToken?.symbol === 'ETH'
        ? sendEthTransactionData?.hash
        : sendERC20TransactionData?.hash,
  });

  return (
    <div className="flex flex-col gap-y-7">
      <InputControlled
        label="Recipient"
        description="Address of the recipient"
        value={recipientAddress}
        setValue={setRecipientAddress}
        error={recipAddressInvalid}
        errorMessage="Invalid address"
      />
      <SelectControlled
        label="Token"
        secondaryLabel={
          userBalanceData &&
          `Balance: ${
            userBalanceData?.formatted?.split('.')[0]
          }.${userBalanceData?.formatted?.split('.')[1]?.slice(0, 3)}`
        }
        description="Token you want to send"
        tokens={tokens}
        selectedToken={selectedToken}
        onChange={setSelectedToken}
      />
      <InputControlled
        label="Amount"
        description="Amount you want to send"
        value={amount}
        setValue={setAmount}
        error={userBalanceInvalid}
        errorMessage="Not enough tokens"
      />
      <button
        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-normal text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        disabled={
          (!sendEthTransaction && !writeERC20Transaction) ||
          !recipientAddress ||
          !amount ||
          isRecipBalanceLoading ||
          recipAddressInvalid ||
          isUserBalanceLoading ||
          userBalanceInvalid
        }
        onClick={() => {
          if (selectedToken?.symbol === 'ETH') {
            sendEthTransaction?.();
          } else {
            writeERC20Transaction?.();
          }
        }}
      >
        {isLoadingERC20Transaction || isLoadingETHTransaction
          ? 'Sending'
          : 'Send'}
        {(isLoadingERC20Transaction || isLoadingETHTransaction) && (
          <svg className="ml-4 block h-4 w-4 animate-spin rounded-full border-2 border-t-indigo-400 text-gray-500"></svg>
        )}
      </button>
    </div>
  );
};

export default SendTab;
