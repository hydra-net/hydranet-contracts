const { ethers } = require("hardhat");
const bonding_depository_abi = require("../abis/bonding_depository");
const provider = require("./provider");
require("dotenv").config();
const { PRIVATE_KEY } = process.env;

async function main() {
    const [deployer] = await ethers.getSigners();
    try {
        const daiAddress = "";
        const bondingContractAddress = "";

        let capacity = ethers.BigNumber.from("1000000000000000000000"); //1000 DAI
        let initialPrice = ethers.BigNumber.from("17946000");
        let buffer = ethers.BigNumber.from("100000");
        let vesting = 60 * 60 * 120;
        let timeToConclusion = 60 * 60 * 120;

        let conclusion;

        let depositInterval = 60 * 60 * 24;
        let tuneInterval = 60 * 60 * 120;

        const block = await ethers.provider.getBlock("latest");
        conclusion = block.timestamp + timeToConclusion;
        console.log("conclusion", conclusion);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider.arbitrumRinkeby);

        const bondingContract = new ethers.Contract(
            bondingContractAddress,
            bonding_depository_abi,
            wallet
        );

        const tx = await bondingContract.create(
            daiAddress,
            [capacity, initialPrice, buffer],
            [true, true],
            [vesting, conclusion],
            [depositInterval, tuneInterval]
        );

        console.log("Owner", deployer.address);
        console.log("Create bond tx:", tx);
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
