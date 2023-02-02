import React, { useState, useRef, useEffect } from 'react';

import { NFTStorage } from 'nft.storage';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const ApplicationForm = ({ sdk }) => {
  const [formState, setFormState] = useState({
    applicationName: '',
    egn: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const imageRef = useRef(null);
  const navigate = useNavigate();
  const [showButtons, setShowButtons] = useState(false);
  const [formsData, setFormsData] = useState([]);
  const [userAddress, setUserAddress] = useState('');

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
    const { applicationName, egn } = formState;
    const imageFile = document.querySelector("input[name='nftImage']").files[0];

    const errors = {};
    setHasError(false);
    setFormErrors(errors);

    if (applicationName === '') {
      errors.applicationName = 'Name is required';
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
    if (!sdk) {
      console.log('sdk object is undefined. Aborting createApplicationForm call.');
      return;
    }
    if (!isFormValid()) {
      return;
    }

    setIsLoading(true);

    try {
      const { applicationName, egn } = formState;
      const imageFile = document.querySelector("input[name='nftImage']").files[0];

      const metadata = await storeNFT(applicationName, imageFile);
      const tokenURI = metadata.url;
      await sdk.createApplicationForm(applicationName, egn, tokenURI, sdk.currentUser).then(() => {
        setShowButtons(true);
      });
      setFormState({
        applicationName: '',
        egn: '',
      });
    } catch (errors) {
      console.log('Error:', errors);
      setHasError(true);
      setErrorMessage(errors.message);
    } finally {
      setIsLoading(false);
    }
    // console.log(sdk);
  };

  useEffect(() => {
    const getFormData = async () => {
      console.log('sdk:', sdk);
      const currentUserAddress = await sdk.getCurrentUserAddress();
      const formIds = await sdk.getApplicationFormsIds();
      let userForm = null;

      for (const id of formIds) {
        const form = await sdk.getApplicationFormData(id, currentUserAddress);
        if (form.user === currentUserAddress) {
          userForm = form;
          break;
        }
      }

      if (userForm !== null) {
        console.log('Form status:', userForm.status);
      } else {
        console.log('Form not found');
      }
    };
    getFormData();
  }, []);

  return (
    <div className="container my-5 py-6">
      <div className="row">
        <div className="col-6 offset-3">
          <h1>Application Form</h1>
          <div className="mt-4">
            {hasError ? <div className="alert alert-danger my-4">{errorMessage}</div> : null}
            <div className={`form-group ${formErrors.applicationName ? 'has-error' : ''}`}>
              <label htmlFor="applicationName">Name</label>
              <input
                type="text"
                className={`form-control ${formErrors.applicationName ? 'is-invalid' : ''}`}
                id="applicationName"
                name="applicationName"
                onChange={handleInputChange}
                value={formState.applicationName}
              />
              {formErrors.applicationName && (
                <div className="invalid-feedback">{formErrors.applicationName}</div>
              )}
            </div>
            <div className={`form-group mt-4 ${formErrors.egn ? 'has-error' : ''}`}>
              <label htmlFor="egn">EGN</label>
              <input
                type="text"
                className={`form-control ${formErrors.egn ? 'is-invalid' : ''}`}
                id="egn"
                name="egn"
                onChange={handleInputChange}
                value={formState.egn}
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
              {formErrors.nftImage && <div className="invalid-feedback">{formErrors.nftImage}</div>}
            </div>
            <div className="d-flex justify-content-center mt-4">
              <Button loading={isLoading} onClick={handleButtonMint} disabled={isLoading}>
                Mint
              </Button>
            </div>
            {showButtons && (
              <div className="d-flex justify-content-center mt-4">
                <Button onClick={() => navigate('/documents', {})}>ID CARD</Button>

                <Button onClick={() => console.log('Document 2 selected')}>Passport</Button>

                <Button onClick={() => console.log('Document 3 selected')}>CAR LICENSE</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
