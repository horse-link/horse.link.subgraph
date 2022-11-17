import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Registry } from "../../generated/schema";

export function createOrUpdatedRegistryEntity(address: string, isMarket: boolean, timestamp: BigInt): void {
  // attempt to load the registry entity
  let registryEntity = Registry.load("registry");

  // if the registry doesnt exist, create a new one to store all the vaults and markets
  if (registryEntity == null) {
    // id should always be registry
    registryEntity = new Registry("registry");

    registryEntity.vaults = [Address.zero().toHexString()];
    registryEntity.markets = [Address.zero().toHexString()];
    registryEntity.lastUpdate = BigInt.zero();
  }

  // if the address is a market
  if (isMarket == true) {
    // clone the current markets
    const markets = registryEntity.markets;

    // appends the new market address
    markets.push(address.toLowerCase());

    // assign the new markets array
    registryEntity.markets = markets;
  
  // if the address is not a market, it is a vault
  } else {
    // clone the current vaults
    const vaults = registryEntity.vaults;

    // append the new vault address
    vaults.push(address.toLowerCase());

    // assign the new vaults array
    registryEntity.vaults = vaults;
  }

  // log timestamp and save entity
  registryEntity.lastUpdate = timestamp;
  registryEntity.save();
}