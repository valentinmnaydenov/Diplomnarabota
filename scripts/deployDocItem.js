const hre = require('hardhat');

async function deployDocItem() {
  await hre.run('compile');

  console.log('⚙️ Deploying DocItem contract...');

  const DocItem = await hre.ethers.getContractFactory('DocItem');
  const docItem = await DocItem.deploy();

  await docItem.deployed();

  console.log('✅ Contract deployed to:', marketItem.address);
}

module.exports = deployDocItem;