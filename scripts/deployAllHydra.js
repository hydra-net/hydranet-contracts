const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account: " + deployer.address);

    const firstEpochNumber = 0;
    const firstBlockNumber = 9938931;

    const WXSN = await ethers.getContractFactory("StakenetERC20Token");
    const wXSN = await WXSN.deploy("Wrapped XSN", "wXSN");

    const HydraAuthority = await ethers.getContractFactory("OlympusAuthority");
    const hydraAuthority = await HydraAuthority.deploy(
        deployer.address,
        deployer.address,
        deployer.address,
        deployer.address
    );

    const HDX = await ethers.getContractFactory("OlympusERC20Token");
    const hdx = await HDX.deploy(hydraAuthority.address);

    const HydraTreasury = await ethers.getContractFactory("OlympusTreasury");
    const hydraTreasury = await HydraTreasury.deploy(hdx.address, "0", hydraAuthority.address);

    await hydraTreasury.enable("0", deployer.address, deployer.address);
    await hydraTreasury.enable("2", wXSN.address, wXSN.address);

    await hydraAuthority.pushVault(hydraTreasury.address, true);

    await wXSN.approve(hydraTreasury.address, "150000000000000000000000000");
    await hydraTreasury.deposit("150000000000000000000000000", wXSN.address, 0);

    const SHDX = await ethers.getContractFactory("sOlympus");
    const sHDX = await SHDX.deploy();

    const GHDX = await ethers.getContractFactory("gOHM");
    const gHDX = await GHDX.deploy(deployer.address, sHDX.address);

    const OlympusStaking = await ethers.getContractFactory("OlympusStaking");
    const staking = await OlympusStaking.deploy(
        hdx.address,
        sHDX.address,
        gHDX.address,
        2200,
        firstEpochNumber,
        firstBlockNumber,
        hydraAuthority.address
    );

    const Distributor = await ethers.getContractFactory("Distributor");
    const distributor = await Distributor.deploy(
        hydraTreasury.address,
        hdx.address,
        staking.address,
        hydraAuthority.address
    );

    await sHDX.setIndex("1");
    await sHDX.setgOHM(gHDX.address);
    await sHDX.initialize(staking.address, hydraTreasury.address);

    console.log("wXSN: " + wXSN.address);
    console.log("Hydra authority: ", hydraAuthority.address);
    console.log("HDX: " + hdx.address);
    console.log("Hydra Treasury: " + hydraTreasury.address);
    console.log("Staked Hdx: " + sHDX.address);
    console.log("Staking Contract: " + staking.address);
    console.log("Distributor: " + distributor.address);
}

main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
