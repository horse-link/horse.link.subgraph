import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { Placed__Params } from "../../generated/Market/Market";
import { Bet } from "../../generated/schema";

export function createBetEntity(params: Placed__Params, amount: BigInt, payout: BigInt, timestamp: BigInt, marketAddress: string, hash: Bytes): Bet {
  // create the entity with the index param as the id - this will allow it to be fetched from a settled event by its id
  const entity = new Bet(params.index.toString());

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

  // intialize bets as being unsettled as this function is called from handlePlaced
  entity.settled = false;

  // store the timestamp for when the bet is created, and the hash for the tx
  entity.createdAt = timestamp;
  entity.createdAtTx = hash.toHexString().toLowerCase();

  // set default value for settledAt and settledAtTx
  entity.settledAt = BigInt.zero();
  entity.settledAtTx = "";

  entity.save();

  // return newly created entity
  return entity;
};

export function settleBet(id: string, timestamp: BigInt, hash: Bytes): void {
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

  // settle bet and store timestamp when its settled as well as tx hash
  entity.settled = true;
  entity.settledAt = timestamp;
  entity.settledAtTx = hash.toHexString().toLowerCase();

  entity.save();
};
