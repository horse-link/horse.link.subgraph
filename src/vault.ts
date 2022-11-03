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
  Withdraw
} from "../generated/Vault/Vault";
import { _createOrUpdateProtocolEntity } from "./utils/protocol";

export function handleApproval(event: Approval): void {}

export function handleDeposit(event: Deposit): void {
  // todo: update the calculation of this delta to be USD value
  const tvlDelta = event.params.value;
  // deposits are increases
  _createOrUpdateProtocolEntity(null, tvlDelta, true);
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePaused(event: Paused): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleTransfer(event: Transfer): void {}

export function handleUnpaused(event: Unpaused): void {}

export function handleWithdraw(event: Withdraw): void {
  // todo: update the calculation of this delta to be USD value
  const tvlDelta = event.params.value;
  // withdraws are decreases
  _createOrUpdateProtocolEntity(null, tvlDelta, false);
}
