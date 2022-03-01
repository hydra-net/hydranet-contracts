const { ethers } = require("hardhat");
const staking_abi = require("../abis/staking");
const provider = require("./provider");
require("dotenv").config();
const { PRIVATE_KEY } = process.env;

async function main() {
    const [owner] = await ethers.getSigners();
    console.log(`Owner Account: ${owner.address}`);
    try {
        const stakingAddr = "";
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider.arbitrumRinkebyProvider);
        var contract = new ethers.Contract(stakingAddr, staking_abi, wallet);

        var result = await contract.index();

        console.log("Staking index", result.toString());
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
