import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi';

import SelectControlled from '../UI/SelectControlled';
import InputControlled from '../UI/InputControlled';
import { parseEther } from 'ethers/lib/utils';

export type tokenOption = {
  id: number;
  name: string;
};

const tokens: tokenOption[] = [
  { id: 1, name: 'ETH' },
  { id: 2, name: 'USDC' },
  { id: 3, name: 'DAI' },
];

type SendTabProps = {
  address?: `0x${string}`;
};

// 0x219723D005E383032ea9Ae43e4A72BdeAd0FA38b

const SendTab = ({ address }: SendTabProps) => {
  const [selectedToken, setSelectedToken] = useState(tokens[0]);

  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [debouncedRecipientAddress] = useDebounce(recipientAddress, 1000);

  const [amount, setAmount] = useState<string>('');
  const [debouncedAmount] = useDebounce(amount, 1000);

  const { config } = usePrepareSendTransaction({
    request: {
      to: debouncedRecipientAddress,
      value: debouncedAmount ? parseEther(debouncedAmount) : undefined,
    },
  });
  const { data, sendTransaction } = useSendTransaction(config);

  // console.log(selectedToken);
  // console.log(debouncedRecipientAddress);

  return (
    <div className="flex flex-col gap-y-7">
      <InputControlled
        label="Recipient"
        description="Address of the recipient"
        value={recipientAddress}
        setValue={setRecipientAddress}
      />
      <SelectControlled
        tokens={tokens}
        selectedToken={selectedToken}
        onChange={setSelectedToken}
      />
      <InputControlled
        label="Amount"
        description="Amount you want to send"
        value={amount}
        setValue={setAmount}
      />
      <button
        className='className="inline-flex active:bg-indigo-800" items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-normal text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400'
        disabled={!sendTransaction || !recipientAddress || !amount}
        onClick={() => sendTransaction?.()}
      >
        Send
      </button>
    </div>
  );
};

export default SendTab;
