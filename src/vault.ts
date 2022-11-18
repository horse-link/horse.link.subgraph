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
import { getVaultDecimals, isHorseLinkVault } from "./addresses";
import { amountFromDecimalsToEther } from "./utils/formatting";
import { createOrUpdateProtocolEntity } from "./utils/protocol";
import { createDeposit, createWithdrawal } from "./utils/vault-transaction";

export function handleApproval(event: Approval): void {}

export function handleDeposit(event: Deposit): void {
  const address = event.address.toHexString();
  // check if the event comes from a horse link vault, if not do nothing
  if (isHorseLinkVault(address) == false) {
    log.info(`${address} is not a horse link vault`, []);
    return;
  }

  // get value to 18 decimal precision
  const decimals = getVaultDecimals(event.address);
  const value = amountFromDecimalsToEther(event.params.value, decimals);

  // deposits increase the tvl in the protocol
  createOrUpdateProtocolEntity(event.block.timestamp, true, null, value);
  createDeposit(event.params, event.transaction, event.block.timestamp, address);
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePaused(event: Paused): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleTransfer(event: Transfer): void {}

export function handleUnpaused(event: Unpaused): void {}

export function handleWithdraw(event: Withdraw): void {
  const address = event.address.toHexString();
  // check if the event comes from a horse link vault, if not do nothing
  if (isHorseLinkVault(address) == false) {
    log.info(`${address} is not a horse link vault`, []);
    return;
  }

  // get value to 18 decimal precision
  const decimals = getVaultDecimals(event.address);
  const value = amountFromDecimalsToEther(event.params.value, decimals);

  // withdraws decrease the tvl in the protocol
  createOrUpdateProtocolEntity(event.block.timestamp, false, null, value);
  createWithdrawal(event.params, event.transaction, event.block.timestamp, address);
}
