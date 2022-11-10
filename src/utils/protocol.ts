import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Protocol } from "../../generated/schema";

function _calculatePercentageDifference(vOneBigInt: BigInt, vTwoBigInt: BigInt): BigDecimal {
  const vOne = new BigDecimal(vOneBigInt);
  const vTwo = new BigDecimal(vTwoBigInt);

  const numerator = vOne.minus(vTwo);
  const denominator = vOne.plus(vTwo).div(BigDecimal.fromString("2"));

  const ret = numerator.div(denominator).times(BigDecimal.fromString("100"));

  // there is no absolute value method on BigDecimal so its simulated here
  if (ret.lt(BigDecimal.zero()) == true) {
    return ret.times(BigDecimal.fromString("-1"));
  } else {
    return ret;
  }
};

export function createOrUpdateProtocolEntity(isIncrease: boolean, inPlayDelta: BigInt | null = null, tvlDelta: BigInt | null = null): void {
  // attempt to load the protocol entity
  let protocolEntity = Protocol.load("protocol");

  // if it doesn't exist (i.e. the protocol has been interacted with for the first time) create it
  if (protocolEntity == null) {
    protocolEntity = new Protocol("protocol");

    // initialize total in play and tvl as zero to start with
    protocolEntity.inPlay = BigInt.zero();
    protocolEntity.tvl = BigInt.zero();

    // default to 100% performance
    protocolEntity.performance = BigDecimal.fromString("100");
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
      // store the new tvl
      const newTvl = protocolEntity.tvl.plus(tvlDelta);

      // calculate the percentage difference between the old tvl and the new tvl and increase the protocol performance
      const performanceDifference = _calculatePercentageDifference(
        protocolEntity.tvl,
        newTvl,
      );
      protocolEntity.performance = protocolEntity.performance.plus(
        performanceDifference,
      );

      // set the protocol tvl to the new tvl
      protocolEntity.tvl = newTvl;

      // if the delta is a decrease
    } else {
      // store the new tvl
      const newTvl = protocolEntity.tvl.minus(tvlDelta);

      // calculate the percentage difference between the old tvl and the new tvl and decrease the protocol performance
      const performanceDifference = _calculatePercentageDifference(
        protocolEntity.tvl,
        newTvl,
      );
      protocolEntity.performance = protocolEntity.performance.minus(
        performanceDifference,
      );

      // set the protocol tvl to the new tvl
      protocolEntity.tvl = newTvl;
    }
  }

  protocolEntity.save();
};
