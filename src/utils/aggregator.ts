import { BigInt } from "@graphprotocol/graph-ts";
import { Aggregator } from "../../generated/schema";

function _initialiseAggregator(): Aggregator {
  const aggregatorEntity = new Aggregator("aggregator");

  aggregatorEntity.totalMarkets = BigInt.zero();
  aggregatorEntity.totalVaults = BigInt.zero();
  aggregatorEntity.totalBets = BigInt.zero();

  return aggregatorEntity;
}

export function incrementMarkets(timestamp: BigInt): void {
  let aggregatorEntity = Aggregator.load("aggregator");
  if (aggregatorEntity == null) {
    aggregatorEntity = _initialiseAggregator();
  }

  const currentMarkets = aggregatorEntity.totalMarkets;
  aggregatorEntity.totalMarkets = currentMarkets.plus(BigInt.fromString("1"));

  aggregatorEntity.lastUpdate = timestamp;
  aggregatorEntity.save();
}

export function incrementVaults(timestamp: BigInt): void {
  let aggregatorEntity = Aggregator.load("aggregator");
  if (aggregatorEntity == null) {
    aggregatorEntity = _initialiseAggregator();
  }

  const currentVaults = aggregatorEntity.totalVaults;
  aggregatorEntity.totalVaults = currentVaults.plus(BigInt.fromString("1"));

  aggregatorEntity.lastUpdate = timestamp;
  aggregatorEntity.save();
}

export function incrementBets(timestamp: BigInt): void {
  let aggregatorEntity = Aggregator.load("aggregator");
  if (aggregatorEntity == null) {
    aggregatorEntity = _initialiseAggregator();
  }

  const currentBets = aggregatorEntity.totalBets;
  aggregatorEntity.totalBets = currentBets.plus(BigInt.fromString("1"));

  aggregatorEntity.lastUpdate = timestamp;
  aggregatorEntity.save();
}