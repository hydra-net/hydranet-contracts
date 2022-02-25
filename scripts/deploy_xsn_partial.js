const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account: " + deployer.address);

    const XSN = await ethers.getContractFactory("StakenetERC20Token");
    const xsn = await XSN.deploy("Stakenet", "XSN");

    const Authority = await ethers.getContractFactory("OlympusAuthority");
    const authority = await Authority.deploy(
        deployer.address,
        deployer.address,
        deployer.address,
        deployer.address
    );

    const OHM = await ethers.getContractFactory("OlympusERC20Token");
    const ohm = await OHM.deploy(authority.address);

    const OlympusTreasury = await ethers.getContractFactory("OlympusTreasury");
    const olympusTreasury = await OlympusTreasury.deploy(ohm.address, "0", authority.address);

    await olympusTreasury.enable("2", xsn.address, xsn.address);

    await authority.pushVault(olympusTreasury.address, true); // replaces ohm.setVault(treasury.address)

    console.log("XSN: " + xsn.address);
    console.log("Olympus Authority: ", authority.address);
    console.log("OHM: " + ohm.address);
    console.log("Olympus Treasury: " + olympusTreasury.address);
}

main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
