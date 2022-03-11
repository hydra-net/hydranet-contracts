const { ethers } = require("hardhat");
const { OlympusTreasury__factory } = require("../types");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account: " + deployer.address);

    const authority = "0x61cab7e0f70410f7ee139928b88f21cdfe31f3bb";
    const ohm = "0xc39e57dc35A33D61C7e415cF62356Ed4EEc9867D";
    const gohm = "0xbC90669E46a958b19d19262A6E6C1989191C80B9";
    const staking = "0xE2743328b9B51F6dd22e99F5e2d0cD964b04D299";
    const treasury = "0xc34E80e9e93ff07FCa8E06c0cDAac20844fbf51c";
    const olympusTreasury = OlympusTreasury__factory.connect(treasury, deployer);

    const depoFactory = await ethers.getContractFactory("OlympusBondDepositoryV2");

    const depo = await depoFactory.deploy(authority, ohm, gohm, staking, treasury);

    await olympusTreasury.enable("8", depo.address, ethers.constants.AddressZero); // enable bond repository to mint HDX using treasury excess reserves

    console.log("Bond Depo: " + depo.address);
}

main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
