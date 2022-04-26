const { ethers } = require("hardhat");
const { formatUnits } = require("ethers/lib/utils");
const provider = require("./provider");
const abisExported = require("./abisExported");
require("dotenv").config();
const { PRIVATE_KEY } = process.env;

async function main() {
    const [owner] = await ethers.getSigners();
    console.log(`Owner Account: ${owner.address}`);
    try {
        const bondingCalcAddr = "";
        const lpTokenAddress = "";

        const wallet = new ethers.Wallet(PRIVATE_KEY, provider.providerRinkeby);
        var contract = new ethers.Contract(bondingCalcAddr, abisExported.bondingCalcAbi, wallet);

        const kValue = await contract.getKValue(lpTokenAddress);
        console.log("K value:", formatUnits(kValue, 18));

        const totalValue = await contract.getTotalValue(lpTokenAddress);
        console.log("Total value:", totalValue);

        const markdown = await contract.markdown(lpTokenAddress);
        console.log("Markdown:", markdown);
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
