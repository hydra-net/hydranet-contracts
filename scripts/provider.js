const { ethers } = require("hardhat");
require("dotenv").config();
const { ARBITRUM_INFURA_URL } = process.env;

const provider = new ethers.providers.JsonRpcProvider(ARBITRUM_INFURA_URL, {
    chainId: Number(421611),
    name: "Arbitrum rinkeby",
});

exports.arbitrumRinkebyProvider = provider;
