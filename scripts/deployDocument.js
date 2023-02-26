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
  const docItemAddress = '0xCA943CED4e2feA91bCA8e4ac40B9A00985A60607';

  await deployDocument(docItemAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
