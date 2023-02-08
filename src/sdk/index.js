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
    const isNFT = await this.docItemContract.nfts(tokenId);
    if (!isNFT) {
      console.error(`Token with ID ${tokenId} is not a valid NFT`);
      return;
    }

    const tx = await this.docItemContract.transfer(from, to, tokenId);
    await tx.wait();

    return tx;
  }

  createApplicationForm = async (name, egn, tokenURI, user) => {
    const tx = await this.documentContract.createApplicationForm(name, tokenURI, egn, user);
    await tx.wait();
    return tx;
  };

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
    const promisesArray = [
      this.documentContract.applicationForms(formId),
      this.docItemContract.tokenURI(formId),
    ];
    const [applicationFormRaw, tokenURI] = await Promise.all(promisesArray);
    const cid = tokenURI.split('ipfs://')[1];
    const tokenURIGatway = `https://ipfs.io/ipfs/${cid}`; // fixed here
    const metadata = await axios(tokenURIGatway);
    const {
      data: { image, name },
    } = metadata;

    console.log(`tokenURIGatway = `, tokenURIGatway);

    const cidImage = image.split('ipfs://')[1];
    console.log(`cidImage = `, cidImage);
    const imageUrl = `https://ipfs.io/ipfs/${cidImage}`;

    console.log(`applicationFormRaw = `, applicationFormRaw);

    const applicationForm = {
      egn: applicationFormRaw.egn.toString(),
      user: applicationFormRaw.user,
      id: applicationFormRaw.id.toString(),
    };

    console.log(`imageUrl = `, imageUrl);

    return {
      ...applicationForm,
      imageUrl,
      name,
    };
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

  // async getIdCardData(id) {
  //   const promisesArray = [this.idCardContract.idCards(id), this.idCardContract.pictureURIs(id)];
  //   const [idCard, pictureURI] = await Promise.all(promisesArray);
  //   const cid = pictureURI.split('ipfs://')[1];
  //   const pictureURIGatway = `https://ipfs.io/ipfs/${cid}`;
  //   const picture = await axios(pictureURIGatway);
  //   console.log('getIdCardData function executed');
  //   return {
  //     ...idCard,
  //     picture,
  //   };
  // }

  // async getApplicationFormCreator(formId) {
  //   return await this.documentContract.formCreators(formId);
  // }
  // async getCurrentUserAddress() {
  //   console.log(this.provider);
  //   return await this.provider.signerData.userAddress;
  // }

  // async isFormFilled(address) {
  //   const filled = await this.documentContract.hasFormBeenFilled(address);
  //   return filled;
  // }
}

export default SDK;
