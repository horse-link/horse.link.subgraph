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
  // check if event comes from horse link market, if not do nothing
  if (isHorseLinkMarket(address) == false) {
    log.info(`${address} is not a horse link market`, []);
    return;
  }

  // assign id to constant so its easier to reference, this corresponds to the original bet's index property
  const id = event.params.id.toString().toLowerCase();

  // assign result for ease of referencing
  const didWin = event.params.result;

  // the bet is settled so it can be marked as such
  settleBet(id, didWin, event.block.timestamp, event.transaction.hash);

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
  const payout = amountFromDecimalsToEther(event.params.payout, decimals);

  // decrease user in play
  changeUserInPlay(event.params.owner, amount, false, event.block.timestamp);

  // if the user win
  if (didWin == true) {
    // tvl is decreased by exposure, and in play is decreased by amount
    const exposure = payout.minus(amount);
    changeProtocolTvl(exposure, false, event.block.timestamp);
    changeProtocolInPlay(amount, false, event.block.timestamp);

    // increase user pnl by exposure
    changeUserPnl(event.params.owner, exposure, true, event.block.timestamp);

    return;
  }

  // if the user lost, in play is *decreased*, and tvl is *increased* by original amount
  changeProtocolInPlay(amount, false, event.block.timestamp);
  changeProtocolTvl(amount, true, event.block.timestamp);

  // decrease user pnl
  changeUserPnl(event.params.owner, referenceBetEntity.amount, false, event.block.timestamp);
}
