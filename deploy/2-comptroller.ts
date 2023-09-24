import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({
    getNamedAccounts,
    deployments: { deploy, getOrNull, get },
    ethers,
    network,
}: HardhatRuntimeEnvironment) => {
    const { deployer } = await getNamedAccounts();

    let comptrollerDeploy = await getOrNull("Comptroller");
    if (!comptrollerDeploy) {
        comptrollerDeploy = await deploy("Comptroller", {
            from: deployer,
            log: true,
            contract: "contracts/Comptroller.sol:Comptroller",
            args: [],
        });
    } else {
        console.log(`Comptroller already deployed at ${comptrollerDeploy.address}`);
    }
};

const tags = ["comptroller"];
export { tags };

export default func;
