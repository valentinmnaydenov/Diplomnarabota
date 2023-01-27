const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Document', function () {
  async function deploy() {
    const DocItem = await ethers.getContractFactory('DocItem');
    const docItem = await DocItem.deploy();
    const Document = await ethers.getContractFactory('Document');
    const document = await Document.deploy(docItem.address);
    return { document, docItem };
  }
  it('Should deploy successfuly', async function () {
    this.timeout(30000);
    const { document, docItem } = await deploy();
    console.log(`DocItem contract deployed at: ${docItem.address}`);
    console.log(`Document contract deployed at: ${document.address}`);
    console.log('Deployment complete!');

    console.log('Deployment complete!');

    expect(docItem.address).to.not.equal('0x0000000000000000000000000000000000000000');

    expect(document.address).to.not.equal('0x0000000000000000000000000000000000000000');
  });
});
