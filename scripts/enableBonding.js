const { ethers } = require("hardhat");
const treasury_abi = require("../abis/treasury_abi");
const provider = require("./provider");
require("dotenv").config();
const { PRIVATE_KEY } = process.env;

async function main() {
    const [owner] = await ethers.getSigners();
    console.log(`Owner Account: ${owner.address}`);
    try {
        const bondDepositoryAddr = "";
        const treasuryAddr = "";
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider.arbitrum);
        const treasuryContract = new ethers.Contract(treasuryAddr, treasury_abi, wallet);

        const tx = await treasuryContract.enable(
            "8",
            bondDepositoryAddr,
            ethers.constants.AddressZero
        );

        console.log("Close tx-es:", tx);
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
