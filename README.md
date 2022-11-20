# Horse-Link Protocol Subgraph

[Subgraph Link](https://thegraph.com/hosted-service/subgraph/horse-link/hl-protocol-goerli)

## Entities

Aggregator - keeps a record of entity counts (NOTE: `id` will always be `aggregator`)

```
Aggregator {
  id: ID!
  totalMarkets: BigInt!
  totalVaults: BigInt!
  totalBets: BigInt!
  lastUpdate: BigInt!
}
```

Protocol - tracks protocol-wide data (NOTE: `id` will always be `protocol`)

```
Protocol {
  id: ID!
  inPlay: BigInt!
  initialTvl: BigInt!
  currentTvl: BigInt!
  performance: BigDecimal!
  lastUpdate: BigInt!
}
```

Registry - reflects the registry contract's data (NOTE: `id` will always be `registry`)

```
Registry {
  id: ID!
  vaults: [String!]!
  markets: [String!]!
  lastUpdate: BigInt!
}
```

Bet - an entity that tracks a single bet and its data (NOTE: `id` will be the bet id, `didWin` will only reflect accurately when `settled` is `true`)

```
Bet {
  id: ID!
  propositionId: Bytes!
  marketId: Bytes!
  marketAddress: String!
  assetAddress: String!
  amount: BigInt!
  payout: BigInt!
  owner: String!
  settled: Boolean!
  didWin: Boolean!
  createdAt: BigInt!
  settledAt: BigInt!
  createdAtTx: String!
  settledAtTx: String!
}
```

Vault Transaction - an entity that tracks a single vault transaction and its data (NOTE: `id` will be the tx hash, `type` will either be `deposit` or `withdraw`)

```
VaultTransaction {
  id: ID!
  type: String!
  vaultAddress: String!
  userAddress: String!
  amount: BigInt!
  timestamp: BigInt!
}
```

## Development

Please note that subgraph code is written in _AssemblyScript_ and NOT Typescript, docs can be found [here](https://www.assemblyscript.org/).

To begin development first run `yarn` and `yarn codegen` to generate the entities and data sources as type-safe classes.

To deploy the subgraph, make sure to have run `yarn codegen` and fetch your access token from the subgraph hosted service dashboard, found [here](https://thegraph.com/hosted-service/dashboard). Then, authorize your device for deployment by running `npx graph auth --product hosted-service <ACCESS_TOKEN>`. Once you've successfully authorized you can run `yarn deploy` to push a new pending version.