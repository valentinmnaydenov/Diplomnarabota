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

  async createApplicationForm(name, egn, tokenURI, user) {
    const tx = await this.documentContract.createApplicationForm(name, tokenURI, egn, user);
    await tx.wait();
    return tx;
  }

  async getApplicationFormsIds() {
    let formIds = [];

    const formsLength = await this.documentContract.getApplicationFormsIdsLenght();

    if (formsLength === 0) {
      return formIds;
    }

    const promisesArray = [];

    for (let i = 0; i < formsLength; i++) {
      promisesArray.push(this.documentContract.applicationFormsIds(i));
    }

    formIds = await Promise.all(promisesArray);
    formIds = formIds.map(id => id.toNumber());

    return formIds;
  }

  async getApplicationFormData(formId) {
    const promisesArray = [this.documentContract.applicationForms(formId)];
    const [applicationFormRaw] = await Promise.all(promisesArray);
    const cid = applicationFormRaw.ipfsLink.split('ipfs://')[1];
    const tokenURIGatway = `https://ipfs.io/ipfs/${cid}`; // fixed here
    const metadata = await axios(tokenURIGatway);
    const {
      data: { image, name },
    } = metadata;

    const cidImage = image.split('ipfs://')[1];
    const imageUrl = `https://ipfs.io/ipfs/${cidImage}`;

    const applicationForm = {
      egn: applicationFormRaw.egn.toString(),
      user: applicationFormRaw.user,
      id: applicationFormRaw.id.toString(),
      status: applicationFormRaw.status,
    };

    return {
      ...applicationForm,
      imageUrl,
      name,
    };
  }

  async approveApplicationForm(formId) {
    const tx = await this.documentContract.approveApplication(formId);
    await tx.wait();
    return tx;
  }

  async rejectApplicationForm(formId) {
    const tx = await this.documentContract.rejectApplication(formId);
    await tx.wait();
    return tx;
  }

  async createIDCard(
    id,
    phoneNumber,
    nationality,
    dateOfBirth,
    identityCardNumber,
    permanentAddress,
    eyeColor,
    height,
    dateOfIssue,
  ) {
    const tx = await this.documentContract.createIDCard(
      id,
      phoneNumber,
      nationality,
      dateOfBirth,
      identityCardNumber,
      permanentAddress,
      eyeColor,
      height,
      dateOfIssue,
      { from: this.defaultAccount },
    );
    await tx.wait();
    return tx;
  }

  async getIDCardsIds() {
    const idCardsIds = await this.contract.getIDCardsIds();
    return idCardsIds.map(id => id.toNumber());
  }

  async getIDCardData(idCardId) {
    const idCard = await this.contract.idCards(idCardId);
    return {
      id: idCard.id.toNumber(),
      phoneNumber: idCard.phoneNumber,
      nationality: idCard.nationality,
      dateOfBirth: idCard.dateOfBirth,
      identityCardNumber: idCard.identityCardNumber.toNumber(),
      permanentAddress: idCard.permanentAddress,
      eyeColor: idCard.eyeColor,
      height: idCard.height,
      dateOfIssue: idCard.dateOfIssue,
    };
  }
}

export default SDK;
