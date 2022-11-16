function _makeLowerCase(value: string, index: i32, self: Array<string>): string {
  return value.toLowerCase();
}

// addresses taken from horse.link readme
export const MARKET_ADDRESSES = [
  // usdt market address
  "0x3bCBfdF39F9D851de004Df7c3B2198A58e9643D5",

  // dia market address
  "0x6dbeD7805BB73aBfE988D0c5a2505e6292c03417"
];

export const VAULT_ADDRESSES = [
  // usdt vault
  "0x266dB92c2236bA8B234B3656532C4178797a14bF",

  // dia vault
  "0x2A866428d095aCC6dD0CE9D843508EdbFe3C4f4a"
];

export function isHorseLinkMarket(address: string): bool {
  return MARKET_ADDRESSES.map<string>(_makeLowerCase).includes(address.toLowerCase());
}

export function isHorseLinkVault(address: string): bool {
  return VAULT_ADDRESSES.map<string>(_makeLowerCase).includes(address.toLowerCase());
}
