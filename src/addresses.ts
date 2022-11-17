import { Registry } from "../generated/schema";

export const USDT_VAULT = "0xe2de33276983F28332A755c5D2Db62380a88e912";
export const USDT_MARKET = "0x44e4cA9f8939142971D5DF043fbdD5Fa6fA1273e";

function _makeLowerCase(value: string, index: i32, self: Array<string>): string {
  return value.toLowerCase();
}

export function isHorseLinkMarket(address: string): bool {
  const registry = Registry.load("registry");
  if (registry == null) return false;

  const markets = registry.markets;
  return markets.map<string>(_makeLowerCase).includes(address.toLowerCase());
}

export function isHorseLinkVault(address: string): bool {
  const registry = Registry.load("registry");
  if (registry == null) return false;

  const vaults = registry.vaults;
  return vaults.map<string>(_makeLowerCase).includes(address.toLowerCase());
}
