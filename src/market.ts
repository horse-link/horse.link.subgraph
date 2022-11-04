import { log } from "@graphprotocol/graph-ts";
import {
  Claimed as ClaimedEvent,
  MarketOwnershipTransferred as MarketOwnershipTransferredEvent,
  Placed as PlacedEvent,
  Settled as SettledEvent,
} from "../generated/Market/Market";
import { closeBet, createBetEntity, fetchBetEntityOrNull } from "./utils/bet";
import { createOrUpdateProtocolEntity } from "./utils/protocol";

export function handleClaimed(event: ClaimedEvent): void {}

export function handleMarketOwnershipTransferred(
  event: MarketOwnershipTransferredEvent,
): void {}

export function handlePlaced(event: PlacedEvent): void {
  // create new bet entity and return it so we can reference its properties to update the protocol entity
  const newBetEntity = createBetEntity(event);

  // the amount in play can be fetched from the new entity
  const inPlayDelta = newBetEntity.amount;

  // placed bets increase total in play
  createOrUpdateProtocolEntity(true, inPlayDelta);
}

export function handleSettled(event: SettledEvent): void {
  // assign id to constant so its easier to reference, this corresponds to the original bet's index property
  const id = event.params.id.toHexString();

  // the bet is settled so it can be marked as closed
  closeBet(id);

  // get the original bet entity so its amount can be referenced
  const referenceBetEntity = fetchBetEntityOrNull(id);

  // if it does not exist exit with an error log
  if (!referenceBetEntity) {
    return log.error(`Could not find reference bet entity with id: ${id}`, []);
  }

  // if the user won
  if (event.params.result) {
    // decrease the total in play by the bet amount, and the tvl by the payout
    createOrUpdateProtocolEntity(
      false,
      referenceBetEntity.amount,
      event.params.payout,
    );

    // if the user didnt win
  } else {
    // decrease the total in play by the bet amount
    createOrUpdateProtocolEntity(false, referenceBetEntity.amount);

    // increase the tvl by the bet amount
    createOrUpdateProtocolEntity(true, null, referenceBetEntity.amount);
  }
}
