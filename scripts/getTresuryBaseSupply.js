const { ethers } = require("hardhat");
const tresury_abi = require("../abis/tresury");
const provider = require("./provider");
require("dotenv").config();
const { PRIVATE_KEY } = process.env;

async function main() {
    const [owner] = await ethers.getSigners();
    console.log(`Owner Account: ${owner.address}`);
    try {
        const tresuryAddr = "";
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider.arbitrumRinkebyProvider);
        var contract = new ethers.Contract(tresuryAddr, tresury_abi, wallet);

        var result = await contract.baseSupply();

        console.log("Tresury base supply", result.toString());
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
