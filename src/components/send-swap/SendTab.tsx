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
  name: string;
  tokenAddress?: `0x${string}`;
};

const tokens: tokenOption[] = [
  { id: 1, name: 'ETH' },
  {
    id: 2,
    name: 'WETH',
    tokenAddress: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  },
  {
    id: 3,
    name: 'DAI',
    tokenAddress: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
  },
];

type SendTabProps = {
  address?: `0x${string}`;
};

// 0x219723D005E383032ea9Ae43e4A72BdeAd0FA38b

const SendTab = ({ address }: SendTabProps) => {
  const [selectedToken, setSelectedToken] = useState(tokens[0]);

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

  const { config: sendEthConfig } = usePrepareSendTransaction({
    request: {
      to: debouncedRecipientAddress,
      value: debouncedAmount ? parseEther(debouncedAmount) : undefined,
    },
    enabled: selectedToken?.name === 'ETH',
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
    enabled: selectedToken?.name !== 'ETH' && debouncedAmount !== '',
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
      selectedToken?.name === 'ETH'
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
        secondaryLabel={`Balance: ${
          userBalanceData?.formatted?.split('.')[0]
        }.${userBalanceData?.formatted?.split('.')[1]?.slice(0, 3)}`}
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
        errorMessage="You don't have enough tokens"
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
          if (selectedToken?.name === 'ETH') {
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
