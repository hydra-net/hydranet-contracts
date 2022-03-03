const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account: " + deployer.address);

    const PHYDRA = await ethers.getContractFactory("StakenetERC20Token");
    const pHydra = await PHYDRA.deploy("Placeholder Hydranet", "pHDX");

    const Authority = await ethers.getContractFactory("OlympusAuthority");
    const authority = await Authority.deploy(
        deployer.address,
        deployer.address,
        deployer.address,
        deployer.address
    );

    const firstEpochNumber = "1";
    const firstBlockNumber = "1646262000";

    const OHM = await ethers.getContractFactory("OlympusERC20Token");
    const ohm = await OHM.deploy(authority.address);

    const SOHM = await ethers.getContractFactory("sOlympus");
    const sOHM = await SOHM.deploy();

    const GOHM = await ethers.getContractFactory("gOHM");
    const gOHM = await GOHM.deploy(deployer.address, sOHM.address);

    const OlympusTreasury = await ethers.getContractFactory("OlympusTreasury");
    const olympusTreasury = await OlympusTreasury.deploy(ohm.address, "0", authority.address);

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

    await olympusTreasury.enable("0", deployer.address, deployer.address);  // enable deployer.address to deposit reserve tokens into treasury
    await olympusTreasury.enable("2", pHydra.address, pHydra.address); // enable pHydra as a reserver token
    await olympusTreasury.enable("8", distributor.address, ethers.constants.AddressZero); // enable distributor address to mint HDX using treasury excess reserves

    // Initialize sohm
    await sOHM.setIndex("7675210820"); // TODO
    await sOHM.setgOHM(gOHM.address);
    await sOHM.initialize(staking.address, olympusTreasury.address);

    await staking.setDistributor(distributor.address);

    await distributor.setBounty("100000000"); // TODO

    const rewardRate = "4000"; // TODO
    await distributor.addRecipient(staking.address, rewardRate);

    await pHydra.approve(olympusTreasury.address, "300000000000000000000000000");
    await olympusTreasury.deposit("300000000000000000000000000", pHydra.address, "150000000000000000"); // deposits 300m pHDX to treasury, mints 150m HDX and keeps 150m pHDX as excess reserves

    console.log("Olympus Authority: ", authority.address);
    console.log("pHDX: ", pHydra.address);
    console.log("HDX: " + ohm.address);
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
