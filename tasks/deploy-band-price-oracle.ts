import { task } from "hardhat/config";

import protocolConfig from "../protocol.config";
import { filterCTokenDeployments } from "./_utils";
import { Deployment } from "hardhat-deploy/types";

// npx hardhat deploy-band-price-oracle --network mainnet

task(
    "deploy-band-price-oracle",
    "Deploys a price oracle from all tokens in deployments refering to Band",
).setAction(async (args, hre, runSuper) => {
    const {
        network,
        ethers,
        getNamedAccounts,
        deployments: { deploy, getOrNull, all },
    } = hre;

    const priceFeedConfig = protocolConfig[network.name].markets;
    const oracleRef = protocolConfig[network.name].oracleRef;

    const { deployer } = await getNamedAccounts();

    const allDeployments = await all();
    const cTokenDeployments = filterCTokenDeployments(allDeployments);

    const { cTokenAddresses, cTickers } = cTokenDeployments.reduce((acc: {cTokenAddresses: string[], cTickers: string[]}, t : any) => {
        acc.cTokenAddresses.push(t.address);
        acc.cTickers.push(retrieveTicker(t));
        return acc;
      }, { cTokenAddresses: [], cTickers: [] });

    const bandOracleTickers = cTickers.map((t) => {
        const cToken = priceFeedConfig[t];
        if (!cToken) throw new Error(`No config found for ${t}`);
        return cToken.bandOracleSymbol;
    });

    const baseUnits = cTickers.map((t) => {
        const cToken = priceFeedConfig[t];
        if (!cToken) throw new Error(`No config found for ${t}`);
        return cToken.baseUnit;
    });

    const oracle = await deploy("BandPriceOracle", {
        from: deployer,
        log: true,
        contract:
            "contracts/PriceOracle/BandPriceOracle.sol:BandPriceOracle",
        args: [oracleRef, cTokenAddresses, bandOracleTickers, baseUnits],
    });

    console.log(`Band oracle address: ${oracle.address}`)
});


//Reusing old logic of ticker retrieval from deploy-price-oracle
function retrieveTicker(deployment: any) {
    return !!deployment.implementation ? deployment.execute.args[5]
            : typeof deployment.args[5] === 'number' 
            ? deployment.args[4] : deployment.args[5] //CEthers (CONE) has a ticker as a 5th argument
}
