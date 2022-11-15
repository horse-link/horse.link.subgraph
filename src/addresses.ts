import { Address } from "@graphprotocol/graph-ts";

function _makeLowerCase(value: string, index: i32, self: Array<string>): string {
  return value.toLowerCase();
}

// addresses taken from horse.link readme
export const MARKET_ADDRESSES = [
  // usdc market address
  "0xAbA5571aF0cC8Ea36bB4553D6C4B935B0F53E91e",

  // dia market address
  "0xA0f8A6eD9Df461541159Fa5f083082A6f6E0f795"
];

export const VAULT_ADDRESSES = [
  // usdc vault
  "0x77049b43746F9DF174829B4AA3931fE0fCF70280",

  // dia vault
  "0x7e8Aa9bC57CA64Bf3F91fcE3B0A5F740239F8f59"
];

export function isHorseLinkMarket(address: string): bool {
  return MARKET_ADDRESSES.map<string>(_makeLowerCase).includes(address.toLowerCase());
}

export function isHorseLinkVault(address: string): bool {
  return VAULT_ADDRESSES.map<string>(_makeLowerCase).includes(address.toLowerCase());
}
