import * as dotenv from "dotenv";
dotenv.config();

import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-deploy";
import "solidity-coverage";
import "@typechain/hardhat";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import { HardhatUserConfig } from "hardhat/config";

import "./tasks";

/** @type import('hardhat/config').HardhatUserConfig */
const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
    showTimeSpent: true,
    currency: "USD",
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    local: {
      url: "http://localhost:8545",
      saveDeployments: false
    },
    testnet: {
      url: "https://api.s0.b.hmny.io",
      accounts: { mnemonic: process.env.TEST_MNEMONIC },
      chainId: 1666700000,
      live: true,
      gasMultiplier: 2,
      saveDeployments: true
    },
    mainnet: {
      url: "https://api.harmony.one",
      accounts: [process.env.PK ?? ''],
      chainId: 1666600000,
      live: true,
      gasPrice: 100e+9,
      gasMultiplier: 2,
      gas: 10e+6
    },
    s1: {
      url: "https://s1.api.harmony.one",
      accounts: { mnemonic: process.env.MNEMONIC },
      chainId: 1666600001,
      live: true,
      gasPrice: 100e+9,
      gasMultiplier: 2,
      gas: 10e+6
    },
    coverage: {
      url: "http://127.0.0.1:8555",
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 50000,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  contractSizer: {
    alphaSort: false,
    disambiguatePaths: false,
    runOnCompile: false,
    strict: false,
    only: [],
    except: [],
  },
};

export default config;
