import { log } from "@graphprotocol/graph-ts";
import { Placed as PlacedEvent } from "../../generated/Market/Market";
import { Bet } from "../../generated/schema";

export const createBetEntity = ({ params: bet }: PlacedEvent): Bet => {
  // create the entity with the index param as the id - this will allow it to be fetched from a settled event by its id
  const entity = new Bet(bet.index.toString());

  entity.propositionId = bet.propositionId;
  entity.marketId = bet.marketId;
  entity.amount = bet.amount;
  entity.payout = bet.payout;

  // toHexString is best for formatting addresses to strings
  entity.owner = bet.owner.toHexString();

  // intialize bets as being unclosed as this function is called from handlePlaced
  entity.closed = false;

  entity.save();

  // return newly created entity
  return entity;
};

export const fetchBetEntityOrNull = (id: string): Bet | void => {
  const entity = Bet.load(id);

  // exit and log an error if the entity could not be found
  if (!entity) {
    return log.error(`Could not fetch bet with id: ${id}`, []);
  }

  return entity;
};

export const closeBet = (id: string): void => {
  const entity = Bet.load(id);

  // exit and log an error if the entity could not be found
  if (!entity) {
    return log.error(`Could not find bet with id: ${id}`, []);
  }

  // exit and log a warning if the bet has already been closed
  if (entity.closed) {
    return log.warning(`Bet with id: ${id} has already been closed`, []);
  }

  entity.closed = true;

  entity.save();
};
