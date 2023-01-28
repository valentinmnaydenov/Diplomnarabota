import React, { useState, useRef } from 'react';
import { NFTStorage } from 'nft.storage';

const ApplicationForm = ({ sdk }) => {
  const [formState, setFormState] = useState({
    nftName: '',
    egn: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const imageRef = useRef(null);

  const handleInputChange = e => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const storeNFT = async (name, imageFile) => {
    const client = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_KEY });
    const metadata = await client.store({
      name,
      image: imageFile,
      description: '',
    });

    return metadata;
  };

  const isFormValid = () => {
    const { nftName, egn } = formState;
    const imageFile = document.querySelector("input[name='nftImage']").files[0];

    const errors = {};
    setHasError(false);
    setFormErrors(errors);

    if (nftName === '') {
      errors.nftName = 'Name is required';
    }

    if (egn === '') {
      errors.egn = 'EGN is required';
    }

    if (!imageFile) {
      errors.nftImage = 'Image is required';
    }

    if (Object.values(errors).length > 0) {
      setFormErrors(errors);
      setHasError(true);
      setErrorMessage('Form error');

      return false;
    } else {
      return true;
    }
  };

  const handleButtonMint = async () => {
    if (!isFormValid()) {
      return;
    }

    setIsLoading(true);

    try {
      const { nftName, egn } = formState;
      const imageFile = document.querySelector("input[name='nftImage']").files[0];

      const metadata = await storeNFT(nftName, imageFile);
      const tokenURI = metadata.cid;
      const collectionID = metadata.collectionId;
      await sdk.createApplicationForm(nftName, egn, tokenURI, collectionID);
    } catch (errors) {
      console.log('Error:', errors);
      setHasError(true);
      setErrorMessage(errors.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container my-5 py-6">
      <div className="row">
        <div className="col-6 offset-3">
          <h1>Application Form</h1>

          <div className="mt-4">
            {hasError ? <div className="alert alert-danger my-4">{errorMessage}</div> : null}
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

              <div className={`form-group mt-4 ${formErrors.egn ? 'has-error' : ''}`}>
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

              <div className={`form-group mt-4 ${formErrors.nftImage ? 'has-error' : ''}`}>
                <label htmlFor="nftImage">Image</label>
                <input
                  type="file"
                  className={`form-control ${formErrors.nftImage ? 'is-invalid' : ''}`}
                  id="nftImage"
                  name="nftImage"
                  ref={imageRef}
                  onChange={handleInputChange}
                />
                {formErrors.nftImage && (
                  <div className="invalid-feedback">{formErrors.nftImage}</div>
                )}
              </div>

              <div className="d-flex justify-content-center mt-4">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleButtonMint}
                  disabled={isLoading}
                >
                  Mint
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
