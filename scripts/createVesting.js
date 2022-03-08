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
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider.arbitrumRinkebyProvider);
        var contract = new ethers.Contract(vestingContractAddr, vesting_abi, wallet);
        const _beneficiary = ""; // wallet to receive tokens
        const _start = "1646759005"; // unix timestamp
        const _cliff = "0";
        const _duration = "600"; // 10 minutes
        const _slicePeriodSeconds = "1";
        const _revokable = true;
        const _amount = "100000000000000000000"; // 100 tokens

        const vestingTx = await contract.createVestingSchedule(
            _beneficiary,
            _start,
            _cliff,
            _duration,
            _slicePeriodSeconds,
            _revokable,
            _amount
        );
        console.log(vestingTx);
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
