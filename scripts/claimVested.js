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
        // const gasPrice = await provider.arbitrum.getGasPrice();
        // const formattedGasPrice = ethers.utils.formatUnits(gasPrice, "wei");
        // var block = await provider.arbitrum.getBlock("latest");
        // var gasLimit = block.gasLimit / block.transactions.length;
        const vestingScheduleId = await contract.computeVestingScheduleIdForAddressAndIndex(
            account,
            0
        );
        console.log("Vesting id:", vestingScheduleId);
        const amount = await contract.computeReleasableAmount(vestingScheduleId);

        console.log("Releasable amount:", amount.toString());
        // const release = await contract.release(vestingScheduleId, amount.toString());
        // console.log(release);
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
