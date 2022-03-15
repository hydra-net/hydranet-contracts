// const { parseUnits } = require("ethers/lib/utils");
const { ethers } = require("hardhat");
const distributor_abi = require("../abis/distributor_abi");
const staking_abi = require("../abis/staking_abi");
const sHdx_abi = require("../abis/sohm");
const Web3 = require("web3");
const provider = require("./provider");
require("dotenv").config();
const { PRIVATE_KEY, ARBITRUM_INFURA_URL } = process.env;

async function main() {
    const [owner] = await ethers.getSigners();
    console.log(`Owner Account: ${owner.address}`);
    try {
        // const distributorContractAddr = "0xAc9Ed7Fb563B4A93bDB43fa3f5B2Bf0dB53DF856";
        const stakingContractAddr = "0xd20CDF95a08ACDf8Aa360232Caeda6E59a06951D";
        const sHDXContractAddress = "0xb7F5ca475D7F62ab9A6729d8118b0E65E666f005";

        const wallet = new ethers.Wallet(PRIVATE_KEY, provider.arbitrum);

        // var distributorContract = new ethers.Contract(
        //     distributorContractAddr,
        //     distributor_abi,
        //     wallet
        // );

        // const bountyRate = await distributorContract.bounty();
        // console.log(bountyRate.toString());

        // const rebaseRate = await distributorContract.info(0);
        // console.log(rebaseRate);

        // const distribute = await distributorContract.distribute();
        // console.log(distribute);

        const stakingContract = new ethers.Contract(stakingContractAddr, staking_abi, wallet);
        const epoch = await stakingContract.epoch();
        console.log("Epoch", epoch);
        // const rebase = await stakingContract.rebase();
        // console.log("Rebsae", rebase);

        var web3 = new Web3(ARBITRUM_INFURA_URL);
        const blokNumber = await web3.eth.getBlockNumber();
        console.log("Blok number:", blokNumber);

        const sHDXContract = new ethers.Contract(sHDXContractAddress, sHdx_abi, wallet);

        const rebase1 = await sHDXContract.rebases(0);
        const rebase2 = await sHDXContract.rebases(1);
        const rebase3 = await sHDXContract.rebases(2);
        const rebase4 = await sHDXContract.rebases(3);
        const rebase5 = await sHDXContract.rebases(4);
        console.log("Rebase 1:", rebase1);
        console.log("Rebase 2:", rebase2);
        console.log("Rebase 3:", rebase3);
        console.log("Rebase 4:", rebase4);
        console.log("Rebase 5:", rebase5);
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
