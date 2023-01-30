import { ethers } from 'ethers';
import axios from 'axios';

const documentJSON = require('./artifacts/contracts/Document.sol/Document.json');
const docItemJSON = require('./artifacts/contracts/DocItem.sol/DocItem.json');

class SDK {
  constructor(_provider) {
    this.provider = _provider;
    this.signer = _provider.signer;
  }

  async initContracts() {
    const documentContract = new ethers.Contract(
      process.env.REACT_APP_ADDRESS_DOCUMENT,
      documentJSON.abi,
      this.signer,
    );

    const docItemContract = new ethers.Contract(
      process.env.REACT_APP_ADDRESS_DOCUMENT_ITEM,
      docItemJSON.abi,
      this.signer,
    );

    this.documentContract = documentContract;
    this.docItemContract = docItemContract;

    const address = await this.signer.getAddress();
    this.currentUser = address;
  }

  async createdocItem(minter, tokenURI) {
    const tx = await this.docItemContract.mintItem(minter, tokenURI);
    await tx.wait();

    return tx;
  }

  async transfer(from, to, tokenId) {
    const tx = await this.docItemContract.transfer(from, to, tokenId);
    await tx.wait();

    return tx;
  }

  async isNFT(tokenId) {
    return await this.docItemContract.nfts(tokenId);
  }

  createApplicationForm = async (name, egn, tokenURI, user) => {
    const tx = await this.documentContract.createApplicationForm(name, egn, tokenURI, egn, user);
    await tx.wait();
    return tx;
  };

  async getApplicationForms() {
    let forms = [];
    const formsLength = await this.documentContract.getApplicationFormsLength();
    const promisesArray = [];

    for (let i = 0; i < formsLength; i++) {
      promisesArray.push(this.documentContract.applicationForms(i));
    }

    forms = await Promise.all(promisesArray);

    return forms;
  }

  async approveApplicationForm(formId) {
    const tx = await this.documentContract.approveApplicationForm(formId);
    await tx.wait();
    return tx;
  }

  async rejectApplicationForm(formId) {
    const tx = await this.documentContract.rejectApplicationForm(formId);
    await tx.wait();
    return tx;
  }

  async getApplicationFormData(formId) {
    const promisesArray = [
      this.documentContract.applicationForms(formId),
      this.docItemContract.tokenURI(formId),
    ];
    const [applicationForm, tokenURI] = await Promise.all(promisesArray);
    const cid = tokenURI.split('ipfs://')[1];
    const tokenURIGatway = `https://ipfs.io/ipfs/${cid}`; // fixed here
    const metadata = await axios(tokenURIGatway);
    const {
      data: { image, name },
    } = metadata;
    return {
      ...applicationForm,
      image,
      name,
    };
  }
}
export default SDK;
