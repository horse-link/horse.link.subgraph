import { log } from "@graphprotocol/graph-ts";
import {
  MarketAdded,
  VaultAdded,
  ThresholdUpdated
} from "../generated/Registry/Registry";
import { createOrUpdatedRegistryEntity } from "./utils/registry";

export function handleMarketAdded(event: MarketAdded): void {
  const address = event.params.market.toHexString();
  createOrUpdatedRegistryEntity(address, true, event.block.timestamp);
  log.info(`Market registered ${address}`, []);
}

export function handleVaultAdded(event: VaultAdded): void {
  const address = event.params.vault.toHexString();
  createOrUpdatedRegistryEntity(address, false, event.block.timestamp);
  log.info(`Vault registered ${address}`, []);
}

export function handleThresholdUpdated(event: ThresholdUpdated): void {}