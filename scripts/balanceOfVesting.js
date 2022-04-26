const { ethers } = require("hardhat");
const vesting_abi = require("../abis/token_vesting");
const provider = require("./provider");
require("dotenv").config();
const { PRIVATE_KEY } = process.env;
async function main() {
    const [owner] = await ethers.getSigners();
    console.log(`Owner Account: ${owner.address}`);
    try {
        const vestingContractAddr = "";
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider.arbitrum);
        var contract = new ethers.Contract(vestingContractAddr, vesting_abi, wallet);
        const withrdawableAmount = await contract.getWithdrawableAmount();
        console.log("Amount:", withrdawableAmount.toString());
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
