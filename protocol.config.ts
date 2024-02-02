import { ProtocolConfig } from "./types";

const config: ProtocolConfig = {
    mainnet: {
        oracleRef: '0xA55d9ef16Af921b70Fed1421C1D298Ca5A3a18F1',
        markets: {
            cWONE: {
                source: "chainlink",
                priceFeed: "0xdcd81fbbd6c4572a69a534d8b8152c562da8abef",
                baseUnit: "1000000000000000000",
                reserveFactor: 0.15,
                collateralFactor: 0.70,
                bandOracleSymbol: 'ONE'
            },
            c1ETH: {
                source: "chainlink",
                priceFeed: "0xbaf7c8149d586055ed02c286367a41e0ada96b7c",
                baseUnit: "1000000000000000000",
                reserveFactor: 0.15,
                collateralFactor: 0.70,
                bandOracleSymbol: 'ETH'
            },
            c1USDC: {
                source: "chainlink",
                priceFeed: "0xa45a41be2d8419b60a6ce2bc393a0b086b8b3bda",
                baseUnit: "1000000",
                reserveFactor: 0.13,
                collateralFactor: 0.85,
                bandOracleSymbol: 'USDC'
            },
            c1USDT: {
              source: "chainlink",
              priceFeed: "0x5caaebe5c69a8287bffb9d00b5231bf7254145bf",
              baseUnit: "1000000",
              reserveFactor: 0.13,
              collateralFactor: 0.85,
              bandOracleSymbol: 'USDT'
            },
            cONE: {
                source: "chainlink",
                priceFeed: "0xdcd81fbbd6c4572a69a534d8b8152c562da8abef",
                baseUnit: "1000000000000000000",
                reserveFactor: 0.15,
                collateralFactor: 0.70,
                bandOracleSymbol: 'ONE'
            },
        },
    },
};

export default config;
