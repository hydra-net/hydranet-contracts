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
    const block = await ethers.provider.getBlock("latest");
    const firstBlockNumber = block.timestamp;

    const HDX = await ethers.getContractFactory("OlympusERC20Token");
    const hdx = await HDX.deploy(authority.address);

    const SHDX = await ethers.getContractFactory("sOlympus");
    const sHDX = await SHDX.deploy();

    const GHDX = await ethers.getContractFactory("gOHM");
    const gHDX = await GHDX.deploy(deployer.address, sHDX.address);

    const OlympusTreasury = await ethers.getContractFactory("OlympusTreasury");
    const olympusTreasury = await OlympusTreasury.deploy(hdx.address, "0", authority.address);

    await authority.pushVault(olympusTreasury.address, true); // replaces ohm.setVault(treasury.address)

    const OlympusStaking = await ethers.getContractFactory("OlympusStaking");
    const staking = await OlympusStaking.deploy(
        hdx.address,
        sHDX.address,
        gHDX.address,
        "28800",
        firstEpochNumber,
        firstBlockNumber,
        authority.address
    );

    await gHDX.migrate(staking.address, sHDX.address);

    const Distributor = await ethers.getContractFactory("Distributor");
    const distributor = await Distributor.deploy(
        olympusTreasury.address,
        hdx.address,
        staking.address,
        authority.address
    );

    const bondsFactory = await ethers.getContractFactory("OlympusBondDepositoryV2");

    const bondingContract = await bondsFactory.deploy(
        authority.address,
        hdx.address,
        gHDX.address,
        staking.address,
        olympusTreasury.address
    );

    const DAI = await ethers.getContractFactory("MockERC20");
    const daiContract = await DAI.deploy("DAI token", "DAI", 18);
    const initialDeposit = "1000000000000000000000000";
    await daiContract.mint(deployer.address, initialDeposit);

    await olympusTreasury.enable("0", deployer.address, deployer.address); // enable deployer.address to deposit reserve tokens into treasury
    await olympusTreasury.enable("2", pHydra.address, pHydra.address); // enable pHydra as a reserver token
    // await olympusTreasury.enable("2", daiContract.address, daiContract.address); // enable DAI as a reserver token
    await olympusTreasury.enable("8", distributor.address, ethers.constants.AddressZero); // enable distributor address to mint HDX using treasury excess reserves
    await olympusTreasury.enable("8", bondingContract.address, ethers.constants.AddressZero);

    // Initialize sohm
    await sHDX.setIndex("1000000000");
    await sHDX.setgOHM(gHDX.address);
    await sHDX.initialize(staking.address, olympusTreasury.address);

    await staking.setDistributor(distributor.address);

    await distributor.setBounty("200000000");

    const rewardRate = "500";
    await distributor.addRecipient(staking.address, rewardRate);

    await pHydra.approve(olympusTreasury.address, "320000000000000000000000000");

    await olympusTreasury.deposit(
        "320000000000000000000000000",
        pHydra.address,
        "160000000000000000"
    ); // deposits 320m pHDX to treasury, mints 160m HDX and keeps 160m pHDX as excess reserves

    console.log("Olympus Authority: ", authority.address);
    console.log("pHDX: ", pHydra.address);
    console.log("HDX: " + hdx.address);
    console.log("sHDX: " + sHDX.address);
    console.log("gHDX: " + gHDX.address);
    console.log("Olympus Treasury: " + olympusTreasury.address);
    console.log("Staking Contract: " + staking.address);
    console.log("Distributor: " + distributor.address);
    console.log("Bond Depo: " + bondingContract.address);
    console.log("Dai contract", daiContract.address);
}

main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
