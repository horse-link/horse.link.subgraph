import { log } from "@graphprotocol/graph-ts";
import {
  MarketAdded,
  VaultAdded,
  ThresholdUpdated
} from "../generated/Registry/Registry";
import { incrementMarkets, incrementVaults } from "./utils/aggregator";
import { createOrUpdatedRegistryEntity } from "./utils/registry";

export function handleMarketAdded(event: MarketAdded): void {
  const address = event.params.market.toHexString();
  createOrUpdatedRegistryEntity(address, true, event.block.timestamp);
  log.info(`Market registered ${address}`, []);

  // increment markets in aggregator
  incrementMarkets();
}

export function handleVaultAdded(event: VaultAdded): void {
  const address = event.params.vault.toHexString();
  createOrUpdatedRegistryEntity(address, false, event.block.timestamp);
  log.info(`Vault registered ${address}`, []);

  // increment vaults in aggregator
  incrementVaults();
}

export function handleThresholdUpdated(event: ThresholdUpdated): void {}