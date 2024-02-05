export type ProtocolConfig = {
  [network: string]: ProtocolNetworkConfig;
};

export type ProtocolNetworkConfig = {
  oracleRef?: `0x${string}`
  timelock?: `0x${string}`;
  multisig?: `0x${string}`;
  markets: {
      [symbol: string]: MarketConfig;
  };
};

export type MarketConfig = {
  source: "chainlink";
  priceFeed: `0x${string}`;
  baseUnit: `1${string}`;
  reserveFactor?: number;
  collateralFactor?: number;
  bandOracleSymbol? : string
};
