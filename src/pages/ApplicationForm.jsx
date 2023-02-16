import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { NFTStorage } from 'nft.storage';

import Button from '../components/ui/Button';

const ApplicationForm = ({ sdk }) => {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({ applicationName: '', egn: '', status: 'pending' });
  const [formErrors, setFormErrors] = useState({});
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [showButtons, setShowButtons] = useState(false);
  const [loadingForms, setLoadingForms] = useState(false);
  const [balance, setBalance] = useState(0);
  const [formPending, setFormPending] = useState(false);

  const handleInputChange = e => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.valAue,
    });
  };

  const storeNFT = async (name, imageFile) => {
    const client = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_KEY });
    const metadata = await client.store({ name, image: imageFile, description: '' });

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

    let balance = await sdk.balanceOf(sdk.currentUser);
    if (!sdk.currentUser) {
      setHasError(true);
      setErrorMessage("You don't have an identity. Please log in.");
      return;
    } else if (balance === 0) {
      setHasError(true);
      setErrorMessage("You don't have enough funds. Please add some funds.");
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
        setFormState({ ...formState, status: 'pending' });
      });
      setFormState({ applicationName: '', egn: '' });
      getApplicationForms();
    } catch (errors) {
      console.log('Error:', errors);
      setHasError(true);
      setErrorMessage(errors.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getApplicationForms = useCallback(async () => {
    if (!sdk) return;

    setLoadingForms(true);

    const formIds = await sdk.getApplicationFormsIds();

    // Check if there are some forms
    if (formIds.length > 0) {
      const formPromises = formIds.map(formId => sdk.getApplicationFormData(formId));
      const forms = await Promise.all(formPromises);

      // Check if user have an pending form
      const foundForm =
        forms.find(form => form.user === sdk.currentUser && form.status === 1) || {};

      setFormPending(Object.keys(foundForm).length > 0);
    }

    setLoadingForms(false);
  }, [sdk]);

  useEffect(() => {
    const checkBalance = async () => {
      setIsLoading(true);
      try {
        const balance = await sdk.docItemContract.balanceOf(sdk.currentUser);
        setBalance(Number(balance.toString()));
      } catch (error) {
        console.log(error);
        setHasError(true);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    sdk && sdk.currentUser && checkBalance();
  }, [sdk]);

  useEffect(() => {
    sdk && getApplicationForms();
  }, [sdk, getApplicationForms]);

  const userHasMinted = balance > 0;

  return (
    <div className="container my-5 py-6">
      <div className="row">
        <div className="col-6 offset-3">
          {loadingForms ? (
            <p className="text-center">Loading...</p>
          ) : (
            <>
              <h1>Application Form</h1>
              {userHasMinted ? (
                <p className="alert alert-info my-6">
                  User has an identity. Go to <Link to="/idcard">idcard creation</Link>
                </p>
              ) : formPending ? (
                <p className="alert alert-info my-6">Please wait for admin to approve the form.</p>
              ) : (
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
                    />{' '}
                    {formErrors.applicationName && (
                      <div className="invalid-feedback">{formErrors.applicationName}</div>
                    )}{' '}
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
                    />{' '}
                    {formErrors.egn && <div className="invalid-feedback">{formErrors.egn}</div>}{' '}
                  </div>
                  <div className={`form-group mt-4 ${formErrors.nftImage ? 'has-error' : ''}`}>
                    <label htmlFor="nftImage">Image</label>
                    <input
                      type="file"
                      className={`form-control ${formErrors.nftImage ? 'is-invalid' : ''}`}
                      id="nftImage"
                      name="nftImage"
                      onChange={handleInputChange}
                    />{' '}
                    {formErrors.nftImage && (
                      <div className="invalid-feedback">{formErrors.nftImage}</div>
                    )}{' '}
                  </div>
                  <div className="d-flex justify-content-center mt-4">
                    <Button loading={isLoading} onClick={handleButtonMint} disabled={isLoading}>
                      Mint
                    </Button>
                  </div>
                  {showButtons && (
                    <div className="d-flex justify-content-center mt-4">
                      <Button onClick={() => navigate('/idcard', {})}>ID CARD</Button>

                      <Button onClick={() => console.log('Document 2 selected')}>Passport</Button>

                      <Button onClick={() => console.log('Document 3 selected')}>
                        CAR LICENSE
                      </Button>
                    </div>
                  )}{' '}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
