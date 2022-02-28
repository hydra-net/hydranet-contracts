const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account: " + deployer.address);

    const PHYDRA = await ethers.getContractFactory("StakenetERC20Token");
    const pHydra = await PHYDRA.deploy("Placeholder Hydra", "pHDR");

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

    await olympusTreasury.enable("0", deployer.address, deployer.address);
    await olympusTreasury.enable("2", pHydra.address, pHydra.address);

    await authority.pushVault(olympusTreasury.address, true); // replaces ohm.setVault(treasury.address)

    await pHydra.approve(olympusTreasury.address, "150000000000000000000000000");
    await olympusTreasury.deposit("150000000000000000000000000", pHydra.address, 0);

    console.log("pHydra: " + pHydra.address);
    console.log("Olympus Authority: ", authority.address);
    console.log("Hydra: " + ohm.address);
    console.log("Olympus Treasury: " + olympusTreasury.address);
}

main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
