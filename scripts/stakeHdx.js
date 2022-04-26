const { ethers } = require("hardhat");
const staking_abi = require("../abis/staking_abi");
const provider = require("./provider");
require("dotenv").config();
const { PRIVATE_KEY } = process.env;
async function main() {
    const [owner] = await ethers.getSigners();
    console.log(`Owner Account: ${owner.address}`);
    try {
        const stakingContractAddr = "0x88ea9280aa8BF3adC68d56BFeC601869b7428eE4";

        const wallet = new ethers.Wallet(PRIVATE_KEY, provider.arbitrumRinkeby);

        const stakingContract = new ethers.Contract(stakingContractAddr, staking_abi, wallet);

        const gasPrice = await provider.arbitrumRinkeby.getGasPrice();
        const formattedGasPrice = ethers.utils.formatUnits(gasPrice, "wei");
        var block = await provider.arbitrumRinkeby.getBlock("latest");
        var gasLimit = block.gasLimit / block.transactions.length;

        const _to = "0x2dE5A4854ac6BE8e820AE83A3AE8A98c90193943";
        const _amount = "1000000000000";
        const _rebasing = true;
        const _claim = true;

        const stake = await stakingContract.stake(_to, _amount, _rebasing, _claim, {
            gasPrice: formattedGasPrice,
            gasLimit: gasLimit,
        });
        console.log(stake);
    } catch (e) {
        console.log(e);
    }
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
