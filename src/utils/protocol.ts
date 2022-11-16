import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Protocol } from "../../generated/schema";

export function createOrUpdateProtocolEntity(timestamp: BigInt, isIncrease: boolean, inPlayDelta: BigInt | null = null, tvlDelta: BigInt | null = null): void {
  // attempt to load the protocol entity
  let protocolEntity = Protocol.load("protocol");

  // if it doesn't exist (i.e. the protocol has been interacted with for the first time) create it
  if (protocolEntity == null) {
    protocolEntity = new Protocol("protocol");

    // initialize total in play and tvl as zero to start with
    protocolEntity.inPlay = BigInt.zero();
    protocolEntity.initialTvl = BigInt.zero();
    protocolEntity.currentTvl = BigInt.zero();

    // set the initial tvl to the first delta
    if (tvlDelta !== null) protocolEntity.initialTvl = tvlDelta;
  }

  // if an inPlayDelta is provided update the inPlay property
  if (inPlayDelta !== null) {
    // if the delta is an increase
    if (isIncrease == true) {
      protocolEntity.inPlay = protocolEntity.inPlay.plus(inPlayDelta);

      // delta is a decrease
    } else {
      protocolEntity.inPlay = protocolEntity.inPlay.minus(inPlayDelta);
    }
  }

  // if a tvlDelta is provided update the tvl property
  if (tvlDelta !== null) {
    // if the delta is an increase
    if (isIncrease == true) {
      // set the protocol tvl to the new tvl
      protocolEntity.currentTvl = protocolEntity.currentTvl.plus(tvlDelta);

      // if the delta is a decrease
    } else {
      // set the protocol tvl to the new tvl
      protocolEntity.currentTvl = protocolEntity.currentTvl.minus(tvlDelta);
    }
  }

  // log timestamp and save entity
  protocolEntity.lastUpdate = timestamp;
  protocolEntity.save();
};
