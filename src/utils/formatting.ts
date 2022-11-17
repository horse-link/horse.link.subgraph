import { BigInt } from "@graphprotocol/graph-ts";

export function usdtAmountToEther(amount: BigInt): BigInt {
  // multiply the 6 decimal precision number by 1 with 12 decimal precision, bringing it up to 18
  const etherPrecisionAmount = amount.times(BigInt.fromString("1000000000000"));
  return etherPrecisionAmount;
}