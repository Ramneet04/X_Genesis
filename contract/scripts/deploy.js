// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  // 1. Get the contract factory
  const Marketplace = await hre.ethers.getContractFactory("NFTMarketplace");

  // 2. Deploy the contract
  const marketplace = await Marketplace.deploy();

  // 3. Wait for it to be deployed (new syntax)
  await marketplace.waitForDeployment();

  // 4. Print deployed address
  console.log("NFT Marketplace deployed to:", marketplace.target);
}

// 5. Run the deployment
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
