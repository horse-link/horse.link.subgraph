import { log } from "@graphprotocol/graph-ts";
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
import { isHorseLinkVault } from "./addresses";
import { createOrUpdateProtocolEntity } from "./utils/protocol";
import { createDeposit, createWithdrawal } from "./utils/vault-transaction";

export function handleApproval(event: Approval): void {}

export function handleDeposit(event: Deposit): void {
  // check if the event comes from a horse link vault, if not do nothing
  if (isHorseLinkVault(event.address) == false) {
    log.info(`${event.address} is not a horse link vault`, []);
    return;
  }

  // deposits increase the tvl in the protocol
  createOrUpdateProtocolEntity(event.block.timestamp, true, null, event.params.value);
  createDeposit(event.params, event.transaction, event.block.timestamp, event.address);
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePaused(event: Paused): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleTransfer(event: Transfer): void {}

export function handleUnpaused(event: Unpaused): void {}

export function handleWithdraw(event: Withdraw): void {
  // check if the event comes from a horse link vault, if not do nothing
  if (isHorseLinkVault(event.address) == false) {
    log.info(`${event.address} is not a horse link vault`, []);
    return;
  }

  // withdraws decrease the tvl in the protocol
  createOrUpdateProtocolEntity(event.block.timestamp, false, null, event.params.value);
  createWithdrawal(event.params, event.transaction, event.block.timestamp, event.address);
}
