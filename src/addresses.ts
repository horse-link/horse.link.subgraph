function _makeLowerCase(value: string, index: i32, self: Array<string>): string {
  return value.toLowerCase();
}

// addresses taken from horse.link readme
export const MARKET_ADDRESSES = [
  // usdt market address
  "0x44e4cA9f8939142971D5DF043fbdD5Fa6fA1273e",

  // dai market address
  "0xCaEE99685Ff8cf80e605cb0E5C073056B2cf642d"
];

export const VAULT_ADDRESSES = [
  // usdt vault
  "0xe2de33276983F28332A755c5D2Db62380a88e912",

  // dai vault
  "0xf6A36eCd0b09C680C2E6AC3DaE3c7C397D9fBe10"
];

export function isHorseLinkMarket(address: string): bool {
  return MARKET_ADDRESSES.map<string>(_makeLowerCase).includes(address.toLowerCase());
}

export function isHorseLinkVault(address: string): bool {
  return VAULT_ADDRESSES.map<string>(_makeLowerCase).includes(address.toLowerCase());
}
