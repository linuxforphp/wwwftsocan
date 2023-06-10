require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");
require('@nomicfoundation/hardhat-ethers');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
    },
    coston: {
      url: "https://coston-api.flare.network/ext/bc/C/rpc",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 16
    },
    songbird: {
      url: "https://songbird-api.flare.network/ext/bc/C/rpc",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 19
    },
    coston2: {
      url: "https://coston2-api.flare.network/ext/C/rpc",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 114,
    },
    flare: {
      url: "https://flare-api.flare.network/ext/C/rpc",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 14,
    }
  },
};

