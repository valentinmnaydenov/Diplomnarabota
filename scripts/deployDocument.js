const { deploy } = require('hardhat');
const { Signer } = require('ethers');

async function deployDocument(docItemAddress) {
  await hre.run('compile');

  console.log('⚙️ Deploying Document contract...');

  const Contract = await hre.ethers.getContractFactory('Document');
  const contract = await Contract.deploy(docItemAddress);

  await contract.deployed();

  console.log('✅ Contract deployed to:', contract.address);
}

async function main() {
  const docItemAddress = '0xadF269d78aA90bCc7bD5A761e11ec7185CD051F8';

  await deployDocument(docItemAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
