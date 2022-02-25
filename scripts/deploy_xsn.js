const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account: " + deployer.address);

    const DAI = "0x0EA36dA8EEBA93dd84BEabF51A11625c966F7E10";

    const Authority = await ethers.getContractFactory("OlympusAuthority");
    const authority = await Authority.deploy(
        deployer.address,
        deployer.address,
        deployer.address,
        deployer.address
    );

    const firstEpochNumber = "1";
    const firstBlockNumber = "1645137800";

    const OHM = await ethers.getContractFactory("OlympusERC20Token");
    const ohm = await OHM.deploy(authority.address);

    const SOHM = await ethers.getContractFactory("sOlympus");
    const sOHM = await SOHM.deploy();

    const GOHM = await ethers.getContractFactory("gOHM");
    const gOHM = await GOHM.deploy(deployer.address, sOHM.address);

    const OlympusTreasury = await ethers.getContractFactory("OlympusTreasury");
    const olympusTreasury = await OlympusTreasury.deploy(ohm.address, "0", authority.address);

    await olympusTreasury.enable("2", DAI, DAI);

    await authority.pushVault(olympusTreasury.address, true); // replaces ohm.setVault(treasury.address)

    const OlympusStaking = await ethers.getContractFactory("OlympusStaking");
    const staking = await OlympusStaking.deploy(
        ohm.address,
        sOHM.address,
        gOHM.address,
        "28800",
        firstEpochNumber,
        firstBlockNumber,
        authority.address
    );

    await gOHM.migrate(staking.address, sOHM.address);

    const Distributor = await ethers.getContractFactory("Distributor");
    const distributor = await Distributor.deploy(
        olympusTreasury.address,
        ohm.address,
        staking.address,
        authority.address
    );

    // Initialize sohm
    await sOHM.setIndex("7675210820"); // TODO
    await sOHM.setgOHM(gOHM.address);
    await sOHM.initialize(staking.address, olympusTreasury.address);

    await staking.setDistributor(distributor.address);

    console.log("Olympus Authority: ", authority.address);
    console.log("OHM: " + ohm.address);
    console.log("sOhm: " + sOHM.address);
    console.log("gOHM: " + gOHM.address);
    console.log("Olympus Treasury: " + olympusTreasury.address);
    console.log("Staking Contract: " + staking.address);
    console.log("Distributor: " + distributor.address);
}

main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
