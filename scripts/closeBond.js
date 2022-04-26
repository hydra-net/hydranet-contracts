const { ethers } = require("hardhat");
const bonding_depository_abi = require("../abis/bonding_depository");
const provider = require("./provider");
require("dotenv").config();
const { PRIVATE_KEY } = process.env;

async function main() {
    const [owner] = await ethers.getSigners();
    console.log(`Owner Account: ${owner.address}`);
    try {
        const bondDepositoryAddr = "";
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider.arbitrumRinkeby);
        const bondingDepository = new ethers.Contract(
            bondDepositoryAddr,
            bonding_depository_abi,
            wallet
        );

        const closeTx0 = await bondingDepository.close(0);

        console.log("Close tx:", closeTx0);
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
