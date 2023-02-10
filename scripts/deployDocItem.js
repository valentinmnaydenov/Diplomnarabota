const hre = require('hardhat');

async function main() {
  await hre.run('compile');

  console.log('⚙️ Deploying DocItem contract...');

  const DocItem = await hre.ethers.getContractFactory('DocItem');
  const docItem = await DocItem.deploy();

  await docItem.deployed();

  console.log('✅ Contract deployed to:', docItem.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
