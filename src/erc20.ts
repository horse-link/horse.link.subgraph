import { log } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../generated/Token/ERC20";
import { isHorseLinkToken } from "./addresses";
import { Transfer } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  const address =  event.address.toHexString();
  if (isHorseLinkToken(address) == false) {
    log.info(`${address} is not a horse link token`, []);
    return;
  }

  // create transfer entity
  const id = event.transaction.hash.toHexString().toLowerCase();
  let entity = Transfer.load(id);
  if (entity !== null) {
    log.error(`Transfer entity with id ${id} already exists`, []);
    return;
  }

  entity = new Transfer(id);
  entity.to = event.params.to.toHexString().toLowerCase();
  entity.from = event.params.from.toHexString().toLowerCase();
  entity.amount = event.params.value;

  entity.timestamp = event.block.timestamp;

  entity.save();
}