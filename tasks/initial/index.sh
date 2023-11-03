#!/bin/(shell)

# NETWORK=mainnet \
# OWNER=0xD0c46E5e40b38eEB3b685fD18550fC54e5aFA0F2 \
# sh ./tasks/initial/index.sh

npx hardhat deploy --network $NETWORK

# disable if the comptroller was already upgraded
npx hardhat upgrade-comptroller --network $NETWORK

# Do not deploy cONE token.
# npx hardhat deploy-native-ctoken \
# --network $NETWORK \
# --native-token-decimals 18 \
# --native-token-name "ONE" \
# --native-token-symbol "ONE" \
# --decimals 8 \
# --comptroller-key "Unitroller" \
# --interest-rate-model-key "MediumRateModel" \
# --owner $OWNER

npx hardhat deploy-ctoken \
--network $NETWORK \
--underlying-address 0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a \
--underlying-decimals 18 \
--underlying-name "Wrapped ONE" \
--underlying-symbol "WONE" \
--decimals 8 \
--comptroller-key "Unitroller" \
--interest-rate-model-key "MediumRateModel" \
--owner $OWNER

npx hardhat deploy-ctoken \
--network $NETWORK \
--underlying-address 0x4cC435d7b9557d54d6EF02d69Bbf72634905Bf11 \
--underlying-decimals 18 \
--underlying-name "ETH" \
--underlying-symbol "1ETH" \
--decimals 8 \
--comptroller-key "Unitroller" \
--interest-rate-model-key "MediumRateModel" \
--owner $OWNER

npx hardhat deploy-ctoken \
--network $NETWORK \
--underlying-address 0xBC594CABd205bD993e7FfA6F3e9ceA75c1110da5 \
--underlying-decimals 6 \
--underlying-name "USD Coin" \
--underlying-symbol "1USDC" \
--decimals 8 \
--comptroller-key "Unitroller" \
--interest-rate-model-key "StableRateModel" \
--owner $OWNER

npx hardhat deploy-ctoken \
--network $NETWORK \
--underlying-address 0xF2732e8048f1a411C63e2df51d08f4f52E598005 \
--underlying-decimals 6 \
--underlying-name "Tether USD" \
--underlying-symbol "1USDT" \
--decimals 8 \
--comptroller-key "Unitroller" \
--interest-rate-model-key "StableRateModel" \
--owner $OWNER


npx hardhat deploy-price-oracle --network $NETWORK

npx hardhat update-price-oracle --network $NETWORK --price-oracle-key "ChainlinkPriceOracle"

npx hardhat support-markets --network $NETWORK

npx hardhat sync-collateral-factors --network $NETWORK

npx hardhat sync-reserve-factors --network $NETWORK
