const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account: " + deployer.address);

    const hdx = "";

    const bondingCalcFactory = await ethers.getContractFactory("OlympusBondingCalculator");

    const bondingCalc = await bondingCalcFactory.deploy(hdx);

    console.log("Bonding calculator: " + bondingCalc.address);
}

main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
