const { parseUnits } = require("ethers/lib/utils");
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
        const vestingContractAddr = "";
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider.arbitrumRinkebyProvider);
        var contract = new ethers.Contract(vestingContractAddr, vesting_abi, wallet);

        const _beneficiary1 = "";
        const _beneficiary2 = "";
        const _beneficiary3 = "";
        const _beneficiary4 = "";
        const _beneficiary5 = "";
        const _start = Math.round(Date.now() / 1000); // unix timestamp in seconds
        const _cliff = "0";

        // 1 year has 365 days,1 day has 24 hours, 1 hour has 60 minutes, 1 minute is 60 seconds
        // 365*24*60*60=31536000 seconds in one year
        const _durationOneYear = "31536000"; // This is 365 days
        const _durationHalfYear = "15768000"; // This is 187.5 days
        const _slicePeriodSeconds = "1";
        const _revokable = true;
        const decimals = BN.from(18);
        const fourMilion = parseUnits("40", 5);
        const oneHundred = parseUnits("1", 4);
        const _amount1234 = parseUnits(fourMilion.toString(), decimals);
        const _amount5 = parseUnits(oneHundred.toString(), decimals);
        console.log("Start of vesting unix:", _start);
        const vestingTx1 = await contract.createVestingSchedule(
            _beneficiary1,
            _start,
            _cliff,
            _durationOneYear,
            _slicePeriodSeconds,
            _revokable,
            _amount1234
        );
        console.log(vestingTx1);
        const vestingTx2 = await contract.createVestingSchedule(
            _beneficiary2,
            _start,
            _cliff,
            _durationOneYear,
            _slicePeriodSeconds,
            _revokable,
            _amount1234
        );
        console.log(vestingTx2);
        const vestingTx3 = await contract.createVestingSchedule(
            _beneficiary3,
            _start,
            _cliff,
            _durationOneYear,
            _slicePeriodSeconds,
            _revokable,
            _amount1234
        );
        console.log(vestingTx3);
        const vestingTx4 = await contract.createVestingSchedule(
            _beneficiary4,
            _start,
            _cliff,
            _durationOneYear,
            _slicePeriodSeconds,
            _revokable,
            _amount1234
        );
        console.log(vestingTx4);
        const vestingTx5 = await contract.createVestingSchedule(
            _beneficiary5,
            _start,
            _cliff,
            _durationHalfYear,
            _slicePeriodSeconds,
            _revokable,
            _amount5
        );
        console.log(vestingTx5);
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
