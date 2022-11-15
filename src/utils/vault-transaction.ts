import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { VaultTransaction } from "../../generated/schema";
import { Deposit__Params, Withdraw__Params } from "../../generated/Vault/Vault";

export function createDeposit(params: Deposit__Params, tx: ethereum.Transaction, timestamp: BigInt, eventAddress: string): void {
  // make sure that the type for deposits will always be "deposit"
  const type = "deposit";

  // entity id will be its transaction hash
  const entity = new VaultTransaction(tx.hash.toHexString().toLowerCase());

  // populate entity fields
  entity.type = type;
  entity.amount = params.value;
  entity.depositerAddress = params.who.toHexString().toLowerCase();

  // the vaultAddress will be the zero address if a tx.to is not provided
  entity.vaultAddress = eventAddress.toLowerCase();

  entity.timestamp = timestamp;

  entity.save();
}

export function createWithdrawal(params: Withdraw__Params, tx: ethereum.Transaction, timestamp: BigInt, eventAddress: string): void {
  // make sure that the type for withdrawals will always be "withdraw"
  const type = "withdraw";

  // entity id will be its transaction hash
  const entity = new VaultTransaction(tx.hash.toHexString().toLowerCase());

  // populate entity fields
  entity.type = type;
  entity.amount = params.value;
  entity.depositerAddress = params.who.toHexString().toLowerCase();

  // the vaultAddress will be the zero address if a tx.to is not provided
  entity.vaultAddress = eventAddress.toLowerCase();

  entity.timestamp = timestamp;

  entity.save();
}
