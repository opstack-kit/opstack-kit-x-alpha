import { optimismPortalABI } from '../constants/abi.js'
import type { Address, Hex } from 'viem'

export const ABI = optimismPortalABI
export const FUNCTION = 'depositTransaction'

export type DepositETHParameters = {
  to: Address
  gasLimit: number
  data?: Hex
  amount: bigint
}
