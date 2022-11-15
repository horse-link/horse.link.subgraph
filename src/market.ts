import { log } from "@graphprotocol/graph-ts";
import {
  OwnershipTransferred,
  Placed,
  Settled,
} from "../generated/Market/Market";
import { isHorseLinkMarket } from "./addresses";
import { settleBet, createBetEntity, fetchBetEntityOrNull } from "./utils/bet";
import { createOrUpdateProtocolEntity } from "./utils/protocol";

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePlaced(event: Placed): void {
  // check if event comes from horse link market, if not do nothing
  if (isHorseLinkMarket(event.address) == false) {
    log.info(`${event.address} is not a horse link market`, []);
    return;
  }

  // create new bet entity and return it so its properties can be referenced when updating the protocol entity
  const newBetEntity = createBetEntity(event.params, event.block.timestamp, event.address, event.transaction.hash);

  // exposure is calculated by the payout minus the bet amount
  const exposure = newBetEntity.payout.minus(newBetEntity.amount);

  // placed bets increase total in play by the bet amount which can come from the new entity, exposure increases tvl
  createOrUpdateProtocolEntity(event.block.timestamp, true, newBetEntity.amount, exposure);
}

export function handleSettled(event: Settled): void {
  // check if event comes from horse link market, if not do nothing
  if (isHorseLinkMarket(event.address) == false) {
    log.info(`${event.address} is not a horse link market`, []);
    return;
  }

  // assign id to constant so its easier to reference, this corresponds to the original bet's index property
  const id = event.params.id.toHexString().toLowerCase();

  // the bet is settled so it can be marked as such
  settleBet(id, event.block.timestamp, event.transaction.hash);

  // get the original bet entity so its amount can be referenced
  const referenceBetEntity = fetchBetEntityOrNull(id);

  // if it does not exist exit with an error log
  if (referenceBetEntity == null) {
    log.error(`Could not find reference bet entity with id: ${id}`, []);
    return;
  }

  // exposure is calculated by payout minus original bet amount
  const exposure = event.params.payout.minus(referenceBetEntity.amount);

  // decrease total in play by the bet amount, and tvl by exposure
  createOrUpdateProtocolEntity(event.block.timestamp, false, referenceBetEntity.amount, exposure);
}
