import { AlphaRouter } from '@uniswap/smart-order-router';
import { Token, CurrencyAmount, TradeType, Percent } from '@uniswap/sdk-core';
import { BaseProvider } from '@ethersproject/providers';
import { chain } from 'wagmi';
import { tokenOption } from '../components/send-swap/SendTab';
import { parseEther, parseUnits } from 'ethers/lib/utils';
import { Protocol } from '@uniswap/router-sdk';

export const V3_SWAP_ROUTER_ADDRESS =
  '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';

const getRouterRoute = async (
  senderAddress: `0x${string}`,
  provider: BaseProvider,
  inToken: tokenOption,
  outToken: tokenOption,
  inTokenAmount: string
) => {
  const router = new AlphaRouter({
    chainId: chain.goerli.id,
    provider: provider,
  });

  const currencyIn = new Token(
    chain.goerli.id,
    inToken?.tokenAddress as string,
    18,
    inToken?.symbol,
    inToken?.name
  );

  const currencyOut = new Token(
    chain.goerli.id,
    outToken?.tokenAddress as string,
    outToken?.decimals as number,
    outToken?.symbol,
    outToken?.name
  );

  const currencyInAmount = CurrencyAmount.fromRawAmount(
    currencyIn,
    parseUnits(inTokenAmount, inToken.decimals).toString()
  );

  const route = await router.route(
    currencyInAmount,
    currencyOut,
    TradeType.EXACT_INPUT,
    {
      recipient: senderAddress,
      slippageTolerance: new Percent(5, 100),
      deadline: Math.floor(Date.now() / 1000 + 1800),
    },
    {
      protocols: [Protocol.V2, Protocol.V3, Protocol.MIXED],
    }
  );

  return route;
};

export default getRouterRoute;
