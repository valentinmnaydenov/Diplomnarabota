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
<<<<<<< HEAD
  const docItemAddress = '0xBB4fAFeAfCD96b98c3155895b60bF8f526a5C651';
=======
  const docItemAddress = '0x327484379BA50d799d31Fb7A0a0e81EAC73Ee7b6';
>>>>>>> 843702e4c8429e3f31e9f252ca3bdfabdb87fbc7

  await deployDocument(docItemAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
