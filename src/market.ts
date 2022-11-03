import {
  Claimed as ClaimedEvent,
  MarketOwnershipTransferred as MarketOwnershipTransferredEvent,
  Placed as PlacedEvent,
  Settled as SettledEvent,
} from "../generated/Market/Market";
import { _createOrUpdateProtocolEntity } from "./utils/protocol";

export function handleClaimed(event: ClaimedEvent): void {}

export function handleMarketOwnershipTransferred(
  event: MarketOwnershipTransferredEvent,
): void {}

export function handlePlaced(event: PlacedEvent): void {
  // todo: update the calculation of this delta to be USD value
  const inPlayDelta = event.params.amount;
  // placed bets increase total in play
  _createOrUpdateProtocolEntity(inPlayDelta, null, true);
}

export function handleSettled(event: SettledEvent): void {
  // boolean for if the user won
  const didWin = event.params.result;
  // todo: update the calculation of this delta to be USD value
  // if the user win on their bet
  if (didWin) {
    // decrease amount in play and tvl (?)
    const tvlDelta = event.params.payout;
    // todo: get bet entity and decrease inPlay by bet amount
    _createOrUpdateProtocolEntity(null, tvlDelta, false);
  } else {
    // if the user didnt win - increase the tvl and decrease the amount in play
    // todo: get bet entity and increase the tvl and decrease amount in play
    _createOrUpdateProtocolEntity(null, null, true); // increase for tvl
    _createOrUpdateProtocolEntity(null, null, false); // decrease amount in play
  }
}
