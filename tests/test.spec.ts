import {
  assert,
  describe,
  test
} from "matchstick-as";
import { BigInt } from "@graphprotocol/graph-ts";

describe("Describe test suite", () => {
  test("basic test", () => {
    // todo: add more tests as subgraph gets developed
    assert.bigIntEquals(new BigInt(1), new BigInt(1));
  })
})