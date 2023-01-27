import React, { useState, useRef } from 'react';
import { NFTStorage } from 'nft.storage';
import { Link } from 'react-router-dom';

import Documents from './Documents';

const ApplicationForm = ({ sdk }) => {
  const [formState, setFormState] = useState({
    nftName: '',
    egn: '',
    image: null, // add image state
  });

  console.log();
  const [formErrors, setFormErrors] = useState({});
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const imageRef = useRef(null);

  const handleInputChange = e => {
    if (e.target.name === 'nftImage') {
      setFormState({ ...formState, image: e.target.files[0] });
    } else {
      setFormState({ ...formState, [e.target.name]: e.target.value });
    }
  };

  const handleFormValidation = () => {
    const { nftName, egn } = formState;
    if (nftName !== '' && egn !== '' && formState.image) {
      setHasError(false);
      return true;
    } else {
      setHasError(true);
      return false;
    }
  };
  const handleButtonMint = async () => {
    setIsLoading(true);
    setErrorMessage('');
    if (!handleFormValidation()) {
      setIsLoading(false);
      setMintSuccess(true);
      return;
    }
    try {
      const { nftName, egn } = formState;
      const imageFile = document.querySelector("input[name='nftImage']").files[0];
      const errors = {};
      if (!nftName) {
        errors.nftName = 'Name is required';
      }
      if (!egn) {
        errors.egn = 'EGN is required';
      }
      if (!imageFile) {
        errors.nftImage = 'Image is required';
      }
      if (Object.values(errors).some(Boolean)) {
        setFormErrors(errors);
        setIsLoading(false);
        return;
      }

      const storeNFT = async (name, imageFile) => {
        const client = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_KEY });
        const metadata = await client.store({
          name,
          image: imageFile,
          description: '',
        });
        return metadata;
      };
      const metadata = await storeNFT(nftName, imageFile);
      const tokenURI = metadata.cid;
      const collectionID = metadata.collectionId;
      await sdk.createApplicationForm(nftName, egn, tokenURI, collectionID);
      setIsLoading(false);
      setMintSuccess(true);
    } catch (errors) {
      console.log('Error:', errors);
      setHasError(true);
      setErrorMessage(errors.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="container my-5">
      {mintSuccess ? <Link to="/Documents"> Documents</Link> : null}
      <h1>Application Form</h1>

      <form>
        <div className={`form-group ${formErrors.nftName ? 'has-error' : ''}`}>
          <label htmlFor="nftName">Name</label>
          <input
            type="text"
            className={`form-control ${formErrors.nftName ? 'is-invalid' : ''}`}
            id="nftName"
            name="nftName"
            onChange={handleInputChange}
          />
          {formErrors.nftName && <div className="invalid-feedback">{formErrors.nftName}</div>}
        </div>

        <div className={`form-group ${formErrors.egn ? 'has-error' : ''}`}>
          <label htmlFor="egn">EGN</label>
          <input
            type="text"
            className={`form-control ${formErrors.egn ? 'is-invalid' : ''}`}
            id="egn"
            name="egn"
            onChange={handleInputChange}
          />
          {formErrors.egn && <div className="invalid-feedback">{formErrors.egn}</div>}
        </div>

        <div className={`form-group ${formErrors.nftImage ? 'has-error' : ''}`}>
          <label htmlFor="nftImage">Image</label>
          <input
            type="file"
            className={`form-control ${formErrors.nftImage ? 'is-invalid' : ''}`}
            id="nftImage"
            name="nftImage"
            ref={imageRef}
            onChange={handleInputChange}
          />
          {formErrors.nftImage && <div className="invalid-feedback">{formErrors.nftImage}</div>}
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleButtonMint}
          disabled={Object.values(formErrors).some(Boolean) || isLoading}
        >
          Mint
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;
