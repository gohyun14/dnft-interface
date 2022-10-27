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
  useProvider,
  useContractRead,
} from 'wagmi';
import { formatEther, parseUnits, formatUnits } from 'ethers/lib/utils';
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import getRouterRoute, {
  V3_SWAP_ROUTER_ADDRESS,
} from '../../utils/getRouterRoute';
import { SwapRoute } from '@uniswap/smart-order-router';
import { TransactionRequest } from '@ethersproject/abstract-provider';

import SelectControlled from '../UI/SelectControlled';
import InputControlled from '../UI/InputControlled';
import { tokenOption, tokens as allTokens } from './SendTab';
import { BigNumber } from 'ethers';
import { sendTransaction } from '@wagmi/core';

type SendTabProps = {
  address?: `0x${string}`;
};

// 0x219723D005E383032ea9Ae43e4A72BdeAd0FA38b

// not sure how to send eth yet with uni api
const tokens = allTokens.filter((token) => token.tokenAddress !== undefined);

const SwapTab = ({ address }: SendTabProps) => {
  const [selectedToken1, setSelectedToken1] = useState(tokens[0]);
  const [selectedToken2, setSelectedToken2] = useState(tokens[1]);

  // verify user balance of first token
  const [amount, setAmount] = useState<string>('');
  const [debouncedAmount] = useDebounce(amount, 1000);
  const [userBalanceInvalid, setUserBalanceInvalid] = useState<boolean>(false);

  const { data: userBalanceData1, isLoading: isUserBalance1Loading } =
    useBalance({
      addressOrName: address,
      chainId: chain.goerli.id,
      token: selectedToken1?.tokenAddress,
      watch: true,
    });

  useEffect(() => {
    if (userBalanceData1) {
      setUserBalanceInvalid(
        parseFloat(userBalanceData1.formatted) < parseFloat(debouncedAmount)
      );
    }
  }, [debouncedAmount, userBalanceData1]);

  // get user balance of second token
  const { data: userBalanceData2, isLoading: isUserBalance2Loading } =
    useBalance({
      addressOrName: address,
      chainId: chain.goerli.id,
      token: selectedToken2?.tokenAddress,
      watch: true,
    });

  // get erc20 allowance
  const {
    data: allowanceData,
    isError,
    isLoading: isAllowanceLoading,
  } = useContractRead({
    address: selectedToken1?.tokenAddress,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address as `0x${string}`, V3_SWAP_ROUTER_ADDRESS],
    enabled: address !== undefined,
    watch: true,
  });

  const [allowanceValid, setAllowanceValid] = useState<boolean>(false);

  useEffect(() => {
    if (debouncedAmount && allowanceData) {
      setAllowanceValid(
        parseFloat(
          formatUnits(allowanceData?.toString(), selectedToken1?.decimals)
        ) >= parseFloat(debouncedAmount)
      );
    }
  }, [debouncedAmount, allowanceData, selectedToken1?.decimals]);

  // console.log(formatUnits(allowanceData?.toString(), selectedToken1?.decimals));
  // console.log(allowanceValid);

  // prepare approve transaction
  const { config: approveERC20Config } = usePrepareContractWrite({
    address: selectedToken1?.tokenAddress,
    abi: erc20ABI,
    functionName: 'approve',
    args: [
      V3_SWAP_ROUTER_ADDRESS,
      debouncedAmount !== ''
        ? parseUnits(debouncedAmount, selectedToken1?.decimals)
        : parseUnits('0', 18),
    ],
    enabled: debouncedAmount !== '' && !allowanceValid && !isAllowanceLoading,
  });

  const {
    data: approveERC20TransactionData,
    write: approveERC20Transaction,
    isLoading: isLoadingApproveERC20Transaction,
  } = useContractWrite(approveERC20Config);

  // get transaction request data from uni api
  const provider = useProvider();

  const [route, setRoute] = useState<SwapRoute | null>(null);

  useEffect(() => {
    const setData = async () =>
      setRoute(
        await getRouterRoute(
          address as `0x${string}`,
          provider,
          selectedToken1 as tokenOption,
          selectedToken2 as tokenOption,
          debouncedAmount !== '' ? debouncedAmount : '0'
        )
      );

    if (address !== undefined && allowanceValid) {
      setData();
    }
  }, [
    address,
    provider,
    selectedToken1,
    selectedToken2,
    debouncedAmount,
    allowanceValid,
  ]);

  const [transactionRequest, setTransactionRequest] = useState<
    TransactionRequest | undefined
  >(undefined);

  useEffect(() => {
    if (route !== null) {
      setTransactionRequest({
        data: route?.methodParameters?.calldata,
        to: V3_SWAP_ROUTER_ADDRESS,
        value: BigNumber.from(route?.methodParameters?.value),
        from: address,
        gasPrice: BigNumber.from(route?.gasPriceWei),
      });
    }
  }, [route, address]);

  // console.log(`Quote Exact In: ${route?.quote.toFixed(2)}`);
  // console.log(`Gas Adjusted Quote In: ${route?.quoteGasAdjusted.toFixed(2)}`);
  // console.log(`Gas Used USD: ${route?.estimatedGasUsedUSD.toFixed(6)}`);

  // prepare swap transaction
  const { config: swapConfig } = usePrepareSendTransaction({
    request: transactionRequest as TransactionRequest & {
      to: string;
    },
    enabled: transactionRequest !== null && allowanceValid,
  });
  const {
    data: swapTransactionData,
    sendTransaction: sendSwapTransaction,
    isLoading: isSwapTransactionLoading,
  } = useSendTransaction({
    ...swapConfig,
    onSuccess() {
      setAmount('');
    },
  });

  // const { isLoading, isSuccess } = useWaitForTransaction({
  //   hash:
  //     selectedToken?.symbol === 'ETH'
  //       ? sendEthTransactionData?.hash
  //       : sendERC20TransactionData?.hash,
  // });

  // console.log(transactionRequest);
  // console.log(route?.methodParameters);

  return (
    <div className="flex flex-col gap-y-7">
      <div className="flex flex-row justify-center gap-x-10">
        <section className=" w-5/12">
          <SelectControlled
            label="Token 1"
            secondaryLabel={
              userBalanceData1 &&
              `Balance: ${
                userBalanceData1?.formatted?.split('.')[0]
              }.${userBalanceData1?.formatted?.split('.')[1]?.slice(0, 3)}`
            }
            description="Token you want to swap"
            tokens={tokens.filter(
              (token) => token.symbol !== selectedToken2?.symbol
            )}
            selectedToken={selectedToken1}
            onChange={setSelectedToken1}
          />
        </section>
        <section className="w-5/12">
          <InputControlled
            label="Token 1 Amount"
            description="Amount you want to swap"
            value={amount}
            setValue={setAmount}
            error={userBalanceInvalid}
            errorMessage="Not enough tokens"
          />
        </section>
      </div>
      <button
        className="mx-auto my-2 h-11 w-11 rounded-full border border-indigo-700 bg-indigo-100 p-2 text-indigo-800 hover:bg-indigo-200 active:bg-indigo-300"
        onClick={() => {
          const token1 = selectedToken1;
          setSelectedToken1(selectedToken2);
          setSelectedToken2(token1);
        }}
      >
        <ArrowsUpDownIcon />
      </button>
      <div className="flex flex-row justify-center gap-x-10">
        <section className="w-5/12">
          <SelectControlled
            label="Token 2"
            secondaryLabel={
              userBalanceData2 &&
              `Balance: ${
                userBalanceData2?.formatted?.split('.')[0]
              }.${userBalanceData2?.formatted?.split('.')[1]?.slice(0, 3)}`
            }
            description="Token you want to recieve"
            tokens={tokens.filter(
              (token) => token.symbol !== selectedToken1?.symbol
            )}
            selectedToken={selectedToken2}
            onChange={setSelectedToken2}
          />
        </section>
        <section className="w-5/12">
          <label
            htmlFor="input"
            className="block text-sm font-medium text-gray-700"
          >
            Token 2 Amount
          </label>
          <div className="mt-1 block w-full  px-3 py-2   sm:text-sm">
            {route ? route?.quote.toFixed(2) : '0'}
          </div>
          <p className="mt-2 text-sm text-gray-500">Amount you will recieve</p>
        </section>
      </div>

      {!allowanceValid &&
        debouncedAmount &&
        !userBalanceInvalid &&
        !isUserBalance1Loading && (
          <button
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-normal text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            disabled={!approveERC20Transaction}
            onClick={() => approveERC20Transaction?.()}
          >
            {isLoadingApproveERC20Transaction ? 'Approving' : 'Approve'}
            {isLoadingApproveERC20Transaction && (
              <svg className="ml-4 block h-4 w-4 animate-spin rounded-full border-2 border-t-indigo-400 text-gray-500"></svg>
            )}
          </button>
        )}

      <button
        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-normal text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        disabled={
          !sendSwapTransaction ||
          !amount ||
          isUserBalance1Loading ||
          userBalanceInvalid ||
          !allowanceValid
        }
        onClick={() => sendSwapTransaction?.()}
      >
        {isSwapTransactionLoading ? 'Swapping' : 'Swap'}
        {isSwapTransactionLoading && (
          <svg className="ml-4 block h-4 w-4 animate-spin rounded-full border-2 border-t-indigo-400 text-gray-500"></svg>
        )}
      </button>
    </div>
  );
};

export default SwapTab;

//sendEthTransaction?.();
