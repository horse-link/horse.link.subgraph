import { log } from "@graphprotocol/graph-ts";
import {
  OwnershipTransferred,
  Placed,
  Settled,
} from "../generated/Market/Market";
import { Bet } from "../generated/schema";
import { getMarketDecimals, isHorseLinkMarket } from "./addresses";
import { createBetEntity, getBetId } from "./utils/bet";
import { amountFromDecimalsToEther } from "./utils/formatting";
import { changeProtocolInPlay, changeProtocolTvl } from "./utils/protocol";
import { changeUserInPlay, changeUserPnl } from "./utils/user";

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePlaced(event: Placed): void {
  const address = event.address.toHexString();
  // check if event comes from horse link market, if not do nothing
  if (isHorseLinkMarket(address) == false) {
    log.info(`${address} is not a horse link market`, []);
    return;
  }

  // get amount and payout to 18 decimal precision
  const decimals = getMarketDecimals(event.address);
  const amount = amountFromDecimalsToEther(event.params.amount, decimals);
  const payout = amountFromDecimalsToEther(event.params.payout, decimals);

  // create new bet entity and return it so its properties can be referenced when updating the protocol entity
  const newBetEntity = createBetEntity(event.params, amount, payout, event.block.timestamp, address, event.transaction.hash);

  // exposure is calculated by the payout minus the bet amount
  const exposure = newBetEntity.payout.minus(newBetEntity.amount);

  // placed bets increase total in play by the bet amount which can come from the new entity, exposure increases tvl
  changeProtocolInPlay(amount, true, event.block.timestamp);
  changeProtocolTvl(exposure, true, event.block.timestamp);

  // increase total in play for user
  changeUserInPlay(event.params.owner, amount, true, event.block.timestamp);
}

export function handleSettled(event: Settled): void {
  const address = event.address.toHexString();
  if (isHorseLinkMarket(address) == false) {
    log.info(`${address} is not a horse link market`, []);
    return;
  }

  // ease of referencing
  const id = event.params.id.toString().toLowerCase();
  const didWin = event.params.result;

  // format id
  const betId = getBetId(id, address);

  const betEntity = Bet.load(betId);
  if (betEntity == null) {
    log.error(`Could not find reference entity with id ${betId}`, []);
    return;
  }
  if (betEntity.settled == true) {
    log.error(`Bet ${betId} is already settled`, []);
    return;
  }

  betEntity.settled = true;
  betEntity.didWin = didWin;
  betEntity.settledAt = event.block.timestamp;
  betEntity.settledAtTx = event.transaction.hash.toHexString().toLowerCase();

  const decimals = getMarketDecimals(event.address);
  const payout = amountFromDecimalsToEther(event.params.payout, decimals);

  // decrease user in play
  changeUserInPlay(event.params.owner, betEntity.amount, false, event.block.timestamp);

  // decrease in play by amount
  changeProtocolInPlay(betEntity.amount, false, event.block.timestamp);

  // if the user win
  if (didWin == true) {
    changeProtocolTvl(payout, false, event.block.timestamp);

    // increase user pnl by exposure
    changeUserPnl(event.params.owner, payout.minus(betEntity.amount), true, event.block.timestamp);
  } else {
    // if the user lost, tvl is *increased* by original amount
    changeProtocolTvl(betEntity.amount, true, event.block.timestamp);

    // decrease user pnl
    changeUserPnl(event.params.owner, betEntity.amount, false, event.block.timestamp);
  }

  betEntity.save();
}
