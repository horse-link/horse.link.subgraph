import { log } from "@graphprotocol/graph-ts";
import { Placed__Params } from "../../generated/Market/Market";
import { Bet } from "../../generated/schema";

export function createBetEntity(params: Placed__Params): Bet {
  // create the entity with the index param as the id - this will allow it to be fetched from a settled event by its id
  const entity = new Bet(params.index.toString());

  // assign bet params
  entity.propositionId = params.propositionId;
  entity.marketId = params.marketId;
  entity.amount = params.amount;
  entity.payout = params.payout;

  // toHexString is best for formatting addresses to strings
  entity.owner = params.owner.toHexString();

  // intialize bets as being unsettled as this function is called from handlePlaced
  entity.settled = false;

  entity.save();

  // return newly created entity
  return entity;
};

export function fetchBetEntityOrNull(id: string): Bet | null {
  const entity = Bet.load(id);

  // log an error if the entity could not be found
  if (entity == null) {
    log.warning(`Could not fetch bet with id: ${id}`, []);
  }

  return entity;
};

export function settleBet(id: string): void {
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

  entity.settled = true;

  entity.save();
};
