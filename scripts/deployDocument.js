const { deploy } = require("hardhat");
const { encode } = require("@openzeppelin/solidity-abi-utils");
const { Signer } = require("ethers");

async function deployDocument(docItemAddress) {
  await hre.run('compile');

  console.log('⚙️ Deploying Document contract...');

  const Contract = await hre.ethers.getContractFactory('Document');
  const contract = await Contract.deploy(docItemAddress);

  await contract.deployed();

  console.log('✅ Contract deployed to:', contract.address);
}

module.exports = deployDocument;