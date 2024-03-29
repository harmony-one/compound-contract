import { task } from "hardhat/config";

import protocolConfig from "../protocol.config";
import { filterCTokenDeployments } from "./_utils";

// npx hardhat deploy-price-oracle --network mainnet

task(
    "deploy-price-oracle",
    "Deploys a price oracle from all tokens in deployments",
).setAction(async (args, hre, runSuper) => {
    const {
        network,
        ethers,
        getNamedAccounts,
        deployments: { deploy, getOrNull, all },
    } = hre;

    const priceFeedConfig = protocolConfig[network.name].markets;

    const { deployer } = await getNamedAccounts();

    const allDeployments = await all();
    const cTokenDeployments = filterCTokenDeployments(allDeployments);

    const cTickers = cTokenDeployments.map((cTokenDeployment: any) =>
        !!cTokenDeployment.implementation
            ? cTokenDeployment.execute.args[5]
            : typeof cTokenDeployment.args[5] === 'number' 
            ? cTokenDeployment.args[4] : cTokenDeployment.args[5], //CEthers (CONE) has a ticker as a 5th argument
    );

    const priceFeeds = cTickers.map((cTicker) => {
        const cToken = priceFeedConfig[cTicker];
        if (!cToken) throw new Error(`No CToken found for ${cTicker}`);
        return cToken.priceFeed;
    });
    const baseUnits = cTickers.map((cTicker) => {
        const cToken = priceFeedConfig[cTicker];
        if (!cToken) throw new Error(`No CToken found for ${cTicker}`);
        return cToken.baseUnit;
    });

    const oracle = await deploy("ChainlinkPriceOracle", {
        from: deployer,
        log: true,
        contract:
            "contracts/PriceOracle/ChainlinkPriceOracle.sol:ChainlinkPriceOracle",
        args: [cTickers, priceFeeds, baseUnits],
    });
});
