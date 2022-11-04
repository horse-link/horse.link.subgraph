import {
  Approval,
  Deposit,
  OwnershipTransferred,
  Paused,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer,
  Unpaused,
  Withdraw,
} from "../generated/Vault/Vault";
import { createOrUpdateProtocolEntity } from "./utils/protocol";

export function handleApproval(event: Approval): void {}

export function handleDeposit(event: Deposit): void {
  // deposits increase the tvl in the protocol
  createOrUpdateProtocolEntity(true, null, event.params.value);
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePaused(event: Paused): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleTransfer(event: Transfer): void {}

export function handleUnpaused(event: Unpaused): void {}

export function handleWithdraw(event: Withdraw): void {
  // withdraws decrease the tvl in the protocol
  createOrUpdateProtocolEntity(false, null, event.params.value);
}
