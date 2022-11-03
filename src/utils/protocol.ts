import { BigInt } from "@graphprotocol/graph-ts";
import { Protocol } from "../../generated/schema";

export const _createOrUpdateProtocolEntity = (inPlayDelta: BigInt | null = null, tvlDelta: BigInt | null = null, isIncrease: boolean) => {
  let protocolEntity = Protocol.load("protocol");
  if (!protocolEntity) {
    protocolEntity = new Protocol("protocol");
    protocolEntity.inPlay = BigInt.zero();
    protocolEntity.tvl = BigInt.zero();
    protocolEntity.performance = BigInt.zero();
  }

  // if an inPlayDelta is provided
  if (inPlayDelta) {
    // update the inPlay property
    // if the delta is an increase
    if (isIncrease) {
      protocolEntity.inPlay = protocolEntity.inPlay.plus(inPlayDelta);
    } else {
      // delta is a decrease
      protocolEntity.inPlay = protocolEntity.inPlay.minus(inPlayDelta);
    }
  }

  // if a tvlDelta is provided
  if (tvlDelta) {
    // update the tvl property
    // if the delta is an increase
    if (isIncrease) {
      protocolEntity.tvl = protocolEntity.tvl.plus(tvlDelta);
      // todo: calculate performance increase
    } else {
      // delta is a decrease
      protocolEntity.tvl = protocolEntity.tvl.minus(tvlDelta)
      // todo: calcaulate performance decrease
    }
  }

  protocolEntity.save();
}