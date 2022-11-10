import { Address } from "@graphprotocol/graph-ts";

// hack to get around tx.to typing issues, it's not pretty but it's what's needed to make assemblyscript work
export function getSource(to: Address | null = null): Address {
  let ret = Address.zero();
  if (to !== null) {
    ret = Address.fromString(to.toHexString());
  }
  return ret;
}
