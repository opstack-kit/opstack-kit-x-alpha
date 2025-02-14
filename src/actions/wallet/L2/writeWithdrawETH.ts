import type { Account, Chain, ContractFunctionArgs, Transport, WalletClient, WriteContractReturnType } from 'viem'
import type { L2WriteContractParameters } from '../../../types/l2Actions.js'
import { type ABI, type FUNCTION, OVM_ETH, type WithdrawETHParameters } from '../../../types/withdrawTo.js'
import { writeWithdrawERC20, type WriteWithdrawERC20Parameters } from './writeWithdrawERC20.js'

export type WriteWithdrawETHParameters<
  TChain extends Chain | undefined = Chain,
  TAccount extends Account | undefined = Account | undefined,
  TChainOverride extends Chain | undefined = Chain | undefined,
> =
  & { args: WithdrawETHParameters }
  & L2WriteContractParameters<
    typeof ABI,
    typeof FUNCTION,
    ContractFunctionArgs<typeof ABI, 'payable', typeof FUNCTION>,
    TChain,
    TAccount,
    TChainOverride
  >

/**
 * Withdraws ETH to an L1 address.
 *
 * @param {Address} to the address to withdraw to on L1
 * @param {Bigint} amount the amount of ETH to withdraw
 * @param {Bigint} minGasLimit the minimum gas limit for the withdrawal
 * @param {Hex} [extraData] the extra data for the withdrawal
 *
 * @returns {Promise<Hash>} the hash of the transaction
 */
export async function writeWithdrawETH<
  TChain extends Chain | undefined = Chain,
  TAccount extends Account | undefined = Account | undefined,
  TChainOverride extends Chain | undefined = Chain | undefined,
>(client: WalletClient<Transport, TChain, TAccount>, {
  args: { to, amount, minGasLimit, extraData = '0x' },
  ...rest
}: WriteWithdrawETHParameters<
  TChain,
  TAccount,
  TChainOverride
>): Promise<WriteContractReturnType> {
  return writeWithdrawERC20(client, {
    args: { l2Token: OVM_ETH, to, amount, minGasLimit, extraData },
    // NOTE: msg.value must = amount or transaction will revert
    // https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/universal/StandardBridge.sol#L306
    value: amount,
    ...rest,
  } as unknown as WriteWithdrawERC20Parameters<TChain, TAccount, TChainOverride>)
}
