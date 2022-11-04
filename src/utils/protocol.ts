import { BigInt } from "@graphprotocol/graph-ts";
import { Protocol } from "../../generated/schema";

export const createOrUpdateProtocolEntity = (
  inPlayDelta: BigInt | null = null,
  tvlDelta: BigInt | null = null,
  isIncrease: boolean,
) => {
  // attempt to load the protocol entity
  let protocolEntity = Protocol.load("protocol");

  // if it doesn't exist (i.e. the protocol has been interacted with for the first time) create it
  if (!protocolEntity) {
    protocolEntity = new Protocol("protocol");

    // initialize everything as zero to start with
    protocolEntity.inPlay = BigInt.zero();
    protocolEntity.tvl = BigInt.zero();
    protocolEntity.performance = BigInt.zero();
  }

  // if an inPlayDelta is provided update the inPlay property
  if (inPlayDelta) {
    // if the delta is an increase
    if (isIncrease) {
      protocolEntity.inPlay = protocolEntity.inPlay.plus(inPlayDelta);

      // delta is a decrease
    } else {
      protocolEntity.inPlay = protocolEntity.inPlay.minus(inPlayDelta);
    }
  }

  // if a tvlDelta is provided update the tvl property
  if (tvlDelta) {
    // if the delta is an increase
    if (isIncrease) {
      protocolEntity.tvl = protocolEntity.tvl.plus(tvlDelta);

      // todo: calculate performance increase

      // delta is a decrease
    } else {
      protocolEntity.tvl = protocolEntity.tvl.minus(tvlDelta);

      // todo: calcaulate performance decrease
    }
  }

  protocolEntity.save();
};
