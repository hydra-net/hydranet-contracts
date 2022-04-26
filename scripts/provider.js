const { ethers } = require("hardhat");
require("dotenv").config();
const { ARBITRUM_INFURA_URL, ARBITRUM_INFURA_RINKEBY_URL, INFURA_RINKEBY_URL } = process.env;

const provider = new ethers.providers.JsonRpcProvider(ARBITRUM_INFURA_URL, {
    chainId: Number(42161),
    name: "Arbitrum",
});

const providerArbitrumRinkeby = new ethers.providers.JsonRpcProvider(ARBITRUM_INFURA_RINKEBY_URL, {
    chainId: Number(421611),
    name: "arbitrum-rinkeby",
});

const providerRinkeby = new ethers.providers.JsonRpcProvider(INFURA_RINKEBY_URL, {
    chainId: Number(4),
    name: "rinkeby",
});

exports.arbitrum = provider;
exports.arbitrumRinkeby = providerArbitrumRinkeby;
exports.providerRinkeby = providerRinkeby;
