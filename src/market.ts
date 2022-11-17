import { log } from "@graphprotocol/graph-ts";
import {
  OwnershipTransferred,
  Placed,
  Settled,
} from "../generated/Market/Market";
import { Bet } from "../generated/schema";
import { getMarketDecimals, isHorseLinkMarket } from "./addresses";
import { settleBet, createBetEntity } from "./utils/bet";
import { amountFromDecimalsToEther } from "./utils/formatting";
import { createOrUpdateProtocolEntity } from "./utils/protocol";

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePlaced(event: Placed): void {
  const address = event.address.toHexString();
  // check if event comes from horse link market, if not do nothing
  if (isHorseLinkMarket(address) == false) {
    log.info(`${address} is not a horse link market`, []);
    return;
  }

  // create new bet entity and return it so its properties can be referenced when updating the protocol entity
  const newBetEntity = createBetEntity(event.params, event.block.timestamp, address, event.transaction.hash);

  // get amount to 18 decimal precision
  const decimals = getMarketDecimals(event.address);
  const amount = amountFromDecimalsToEther(newBetEntity.amount, decimals);

  // exposure is calculated by the payout minus the bet amount
  const exposure = newBetEntity.payout.minus(amount);

  // placed bets increase total in play by the bet amount which can come from the new entity, exposure increases tvl
  createOrUpdateProtocolEntity(event.block.timestamp, true, amount, exposure);
}

export function handleSettled(event: Settled): void {
  const address = event.address.toHexString();
  // check if event comes from horse link market, if not do nothing
  if (isHorseLinkMarket(address) == false) {
    log.info(`${address} is not a horse link market`, []);
    return;
  }

  // assign id to constant so its easier to reference, this corresponds to the original bet's index property
  const id = event.params.id.toString().toLowerCase();

  // the bet is settled so it can be marked as such
  settleBet(id, event.block.timestamp, event.transaction.hash);

  // get the original bet entity so its amount can be referenced
  const referenceBetEntity = Bet.load(id);

  // if it does not exist exit with an error log
  if (referenceBetEntity == null) {
    log.error(`Could not find reference bet entity with id: ${id}`, []);
    return;
  }

  // get amount and payout to 18 decimal precision
  const decimals = getMarketDecimals(event.address);
  const amount = amountFromDecimalsToEther(referenceBetEntity.amount, decimals);
  const payout = amountFromDecimalsToEther(referenceBetEntity.payout, decimals);

  // if the user wins
  if (event.params.result == true) {
    // tvl is decreased by exposure, and in play is decreased by amount
    const exposure = payout.minus(amount);
    createOrUpdateProtocolEntity(event.block.timestamp, false, amount, exposure);
    return;
  }

  // if the user lost, in play is *decreased*, and tvl is *increased* by original amount
  createOrUpdateProtocolEntity(event.block.timestamp, false, amount, null);
  createOrUpdateProtocolEntity(event.block.timestamp, true, null, amount);
}
