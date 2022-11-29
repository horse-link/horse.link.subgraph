# Horse-Link Protocol Subgraph

[Subgraph Link](https://thegraph.com/hosted-service/subgraph/horse-link/hl-protocol-goerli)

## Entities

### Aggregator

Keeps a record of entity counts (NOTE: `id` will always be `aggregator`)

```graphql
Aggregator @entity {
  id: ID!
  totalMarkets: BigInt!
  totalVaults: BigInt!
  totalBets: BigInt!
  lastUpdate: BigInt!
}
```

### Protocol 

Tracks protocol-wide data (NOTE: `id` will always be `protocol`)

```graphql
Protocol @entity {
  id: ID!
  inPlay: BigInt!
  initialTvl: BigInt!
  currentTvl: BigInt!
  performance: BigDecimal!
  lastUpdate: BigInt!
}
```

### Registry 

Reflects the registry contract's data (NOTE: `id` will always be `registry`)

```graphql
Registry @entity {
  id: ID!
  vaults: [String!]!
  markets: [String!]!
  lastUpdate: BigInt!
}
```

### Bet 

An entity that tracks a single bet and its data (NOTE: `id` will be the bet id, `didWin` will only reflect accurately when `settled` is `true`)

```graphql
Bet @entity {
  id: ID!
  propositionId: Bytes!
  marketId: Bytes!
  marketAddress: String!
  assetAddress: String!
  amount: BigInt!
  payout: BigInt!
  payoutAt: BigInt!
  owner: String!
  settled: Boolean!
  didWin: Boolean!
  createdAt: BigInt!
  settledAt: BigInt!
  createdAtTx: String!
  settledAtTx: String!
}
```

### Vault Transaction 

An entity that tracks a single vault transaction and its data (NOTE: `id` will be the tx hash, `type` will either be `deposit` or `withdraw`)

```graphql
VaultTransaction @entity {
  id: ID!
  type: String!
  vaultAddress: String!
  userAddress: String!
  amount: BigInt!
  timestamp: BigInt!
}
```

### User

An entity that tracks data about a single user (NOTE: `id` will be the user's address)

```graphql
User @entity {
  id: ID!
  totalDeposited: BigInt!
  inPlay: BigInt!
  pnl: BigInt!
  lastUpdate: BigInt!
}
```

## Development

Please note that subgraph code is written in _AssemblyScript_ and NOT Typescript, docs can be found [here](https://www.assemblyscript.org/).

To begin development first run `yarn` and `yarn codegen` to generate the entities and data sources as type-safe classes.

To deploy the subgraph, make sure to have run `yarn codegen` and fetch your access token from the subgraph hosted service dashboard, found [here](https://thegraph.com/hosted-service/dashboard). Then, authorize your device for deployment by running `npx graph auth --product hosted-service <ACCESS_TOKEN>`. Once you've successfully authorized you can run `yarn deploy` to push a new pending version.