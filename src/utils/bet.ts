import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { Placed__Params } from "../../generated/Market/Market";
import { Bet } from "../../generated/schema";
import { getMarketAssetAddress } from "../addresses";
import { incrementBets } from "./aggregator";

export function createBetEntity(params: Placed__Params, amount: BigInt, payout: BigInt, timestamp: BigInt, marketAddress: string, hash: Bytes): Bet {
  // check if entity exists already
  let entity = Bet.load(params.index.toString());
  // if the bet does not exist already
  if (entity == null) {
    // increment bets in aggregator
    incrementBets(timestamp);
    // create the entity with the index param as the id - this will allow it to be fetched from a settled event by its id
    entity = new Bet(params.index.toString());
  }

  // assign bet params
  entity.propositionId = params.propositionId;
  entity.marketId = params.marketId;

  // amount and payout are formatted to 18 decimals
  entity.amount = amount;
  entity.payout = payout;

  // toHexString is best for formatting addresses to strings
  entity.owner = params.owner.toHexString().toLowerCase();

  // store the market address
  entity.marketAddress = marketAddress.toLowerCase();

  // store the asset address
  entity.assetAddress = getMarketAssetAddress(Address.fromString(marketAddress));

  // store the timestamp for when the bet is created, and the hash for the tx
  entity.createdAt = timestamp;
  entity.createdAtTx = hash.toHexString().toLowerCase();

  // intialize bets as being unsettled
  entity.settled = false;

  // initialize bets as a loss - will reflect accurately when settled is true
  entity.didWin = false;

  // set default value for settledAt and settledAtTx
  entity.settledAt = BigInt.zero();
  entity.settledAtTx = "";

  entity.save();

  // return newly created entity
  return entity;
};

export function settleBet(id: string, didWin: boolean, timestamp: BigInt, hash: Bytes): void {
  const entity = Bet.load(id);

  // exit and log an error if the entity could not be found
  if (entity == null) {
    log.error(`Could not find bet with id: ${id}`, []);
    return;
  }

  // exit and log a warning if the bet has already been settled
  if (entity.settled == true) {
    log.warning(`Bet with id: ${id} has already been settled`, []);
    return;
  }

  // settle bet with result and store timestamp when its settled as well as tx hash
  entity.settled = true;
  entity.didWin = didWin;
  entity.settledAt = timestamp;
  entity.settledAtTx = hash.toHexString().toLowerCase();

  entity.save();
};
