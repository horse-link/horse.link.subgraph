import { BigInt } from "@graphprotocol/graph-ts"
import {
  Vault,
  Approval,
  Deposit,
  OwnershipTransferred,
  Paused,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer,
  Unpaused,
  Withdraw
} from "../generated/Vault/Vault"
import { Protocol } from "../generated/schema"

export function handleApproval(event: Approval): void {}

export function handleDeposit(event: Deposit): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePaused(event: Paused): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleTransfer(event: Transfer): void {}

export function handleUnpaused(event: Unpaused): void {}

export function handleWithdraw(event: Withdraw): void {}
