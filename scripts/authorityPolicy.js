const { ethers } = require("hardhat");
const abisExported = require("./abisExported");
const provider = require("./provider");
require("dotenv").config();
const { PRIVATE_KEY } = process.env;

async function main() {
    const [owner] = await ethers.getSigners();
    console.log(`Owner Account: ${owner.address}`);
    try {
        const authorityAddr = "";
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider.providerRinkeby);
        const authorityContract = new ethers.Contract(
            authorityAddr,
            abisExported.authorityAbi,
            wallet
        );

        const pushPolicyTx = await authorityContract.pushPolicy("", true);

        console.log("Push policy tx:", pushPolicyTx);
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
