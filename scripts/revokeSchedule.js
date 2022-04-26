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
        const account = "";
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider.arbitrum);
        var contract = new ethers.Contract(vestingContractAddr, vesting_abi, wallet);
        const _end = Math.round(Date.now() / 1000); // unix timestamp in seconds
        console.log("Vesting end:", _end);
        const vestingScheduleId = await contract.computeVestingScheduleIdForAddressAndIndex(
            account,
            0
        );
        console.log("Vesting id:", vestingScheduleId);
        const revoke = await contract.revoke(vestingScheduleId);
        console.log(revoke);
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
