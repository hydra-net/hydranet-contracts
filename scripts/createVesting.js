const { ethers } = require("hardhat");
const vesting_abi = require("../abis/token_vesting");
const provider = require("./provider");
require("dotenv").config();
const { PRIVATE_KEY } = process.env;

const BN = ethers.BigNumber;

async function main() {
    const [owner] = await ethers.getSigners();
    console.log(`Owner Account: ${owner.address}`);
    try {
        const vestingContractAddr = "0xf7C14bc7dD8dd1eD95Be525A4282E7fb3313f39D";
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider.arbitrum);
        var contract = new ethers.Contract(vestingContractAddr, vesting_abi, wallet);

        const _beneficiary1 = "0x232984c47CbAA5CeC45cEc536d4de07E248ff313";

        const _start = Math.round(Date.now() / 1000); // unix timestamp in seconds

        const _durationSixMonths = "15778800";
        const _cliff = _durationSixMonths;
        const _slicePeriodSeconds = "1";
        const _revokable = true;
        const _amount = BN.from("400000000000000000000000");
        console.log("Amount", _amount);

        console.log("Start of vesting unix:", _start);
        const vestingTx1 = await contract.createVestingSchedule(
            _beneficiary1,
            _start,
            _cliff,
            _durationSixMonths,
            _slicePeriodSeconds,
            _revokable,
            _amount
        );
        console.log(vestingTx1);
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
