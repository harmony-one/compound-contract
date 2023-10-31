import { task, types } from "hardhat/config";

// npx hardhat deploy-native-ctoken \
// --network mainnet \
// --native-token-decimals 18 \
// --native-token-name "Name" \
// --native-token-symbol "SYMBOL" \
// --decimals 8 \
// --comptroller-key "Comptroller" \
// --interest-rate-model-key "MediumRateModel" \
// --owner "0xD0c46E5e40b38eEB3b685fD18550fC54e5aFA0F2"

task("deploy-native-ctoken", "Deploys a new ctoken")
  .addParam("nativeTokenDecimals", "Native asset's decimals", 18, types.int)
  .addParam("nativeTokenName", "Native asset's name")
  .addParam("nativeTokenSymbol", "Native asset's symbol")
  .addParam("decimals", "Decimals of the cToken", 8, types.int)
  .addParam("comptrollerKey", "Key of the comptroller")
  .addParam("interestRateModelKey", "Key of the interest rate model")
  .addParam("owner", "Owner of the cToken")
  .setAction(async (args, hre, runSuper) => {
    const {
      nativeTokenDecimals,
      nativeTokenName,
      nativeTokenSymbol,
      decimals,
      comptrollerKey,
      interestRateModelKey,
      owner,
    } = args;
    const {
      ethers,
      getNamedAccounts,
      deployments: { deploy, get },
    } = hre;

    const { deployer } = await getNamedAccounts();

    const contractKey = `C${nativeTokenSymbol}`;
    const cTokenName = `Compound ${nativeTokenName}`;
    const cTokenSymbol = `c${nativeTokenSymbol}`;

    let cToken;

    const comptrollerDeploy = await get(comptrollerKey);
    const interestRateModelDeploy = await get(interestRateModelKey);
    const initialExchangeRateMantissa = ethers.utils.parseUnits(
      "0.02",
      nativeTokenDecimals + 18 - decimals
    );

    try {
      cToken = await get(contractKey);
    } catch {
      console.log("deploying from", deployer);
      cToken = await deploy(contractKey, {
        from: deployer,
        log: true,
        contract: "contracts/CONE.sol:CONE",
        args: [
          comptrollerDeploy.address,
          interestRateModelDeploy.address,
          initialExchangeRateMantissa,
          cTokenName,
          cTokenSymbol,
          decimals,
          owner,
        ],
      });
    }
  });
