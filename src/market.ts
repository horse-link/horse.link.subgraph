import {
  Claimed as ClaimedEvent,
  MarketOwnershipTransferred as MarketOwnershipTransferredEvent,
  Placed as PlacedEvent,
  Settled as SettledEvent
} from "../generated/Market/Market"
import {
  Protocol
} from "../generated/schema"

export function handleClaimed(event: ClaimedEvent): void {}

export function handleMarketOwnershipTransferred(event: MarketOwnershipTransferredEvent): void {}

export function handlePlaced(event: PlacedEvent): void {}

export function handleSettled(event: SettledEvent): void {}
