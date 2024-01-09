import { task } from "hardhat/config";

// npx hardhat deploy-maximillion --network hardhat

task("deploy-maximillion", "Deploys a maximillion for cONE contract").setAction(
    async (args, hre, runSuper) => {
        const {
            ethers,
            getNamedAccounts,
            deployments: { deploy, getOrNull, all },
        } = hre;

        const { deployer } = await getNamedAccounts();

        const allDeployments = await all();

        //In other networks - CEther. In harmony - CONE
        const nativecTokenDeployment = allDeployments["CONE"]

        const maximillionDeploy = await deploy("Maximillion", {
            from: deployer,
            log: true,
            contract: "contracts/Maximillion.sol:Maximillion",
            args:  [ nativecTokenDeployment.address ],
        });
    }
);
