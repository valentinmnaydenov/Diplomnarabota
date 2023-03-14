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
  const docItemAddress = '0x96ee6E7D00d4BD15f9E3d8f26C1952412f27824C';

  await deployDocument(docItemAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
