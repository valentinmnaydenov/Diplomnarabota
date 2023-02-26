import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/ui/Button';

const IDcard = ({ sdk }) => {
  const [loadingData, setLoadingData] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [hasUserIdentity, setHasUserIdentity] = useState(false);
  const [userIdentity, setUserIdentity] = useState({});
  const [idcardPending, setidcardPending] = useState(false);
  const [identityID, setidentityID] = useState('');
  const [nationalityError, setNationalityError] = useState(null);
  const [phoneNumberError, setPhoneNumberError] = useState(null);
  const [dateOfBirthError, setDateOfBirthError] = useState(null);
  const [identityCardNumberError, setIdentityCardNumberError] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [dateOfIssueError, setDateOfIssueError] = useState(null);
  const [eyeError, setEyeError] = useState(null);
  const [heightError, setHeightError] = useState('');

  const [idCardData, setIdCardData] = useState({
    id: '',
    phoneNumber: '',
    nationality: '',
    dateOfBirth: '',
    identityCardNumber: '',
    permanentAddress: '',
    eyeColor: '',
    height: '',
    dateOfIssue: '',
    status: 'pending',
  });

  const handleInputChange = e => {
    setIdCardData({ ...idCardData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let valid = true;

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(idCardData.phoneNumber)) {
      setPhoneNumberError('Invalid phone number');
      valid = false;
    } else {
      setPhoneNumberError(null);
    }

    // Validate date of birth
    const dob = new Date(idCardData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (age < 18) {
      setDateOfBirthError('You must be at least 18 years old');
      valid = false;
    } else {
      setDateOfBirthError(null);
    }

    // Validate identity card number
    const idRegex = /^[A-Z]{2}\d{6}$/;
    if (!idRegex.test(idCardData.identityCardNumber)) {
      setIdentityCardNumberError('Invalid identity card number');
      valid = false;
    } else {
      setIdentityCardNumberError(null);
    }

    // Validate address
    if (!idCardData.permanentAddress) {
      setAddressError('Address is required');
      valid = false;
    } else {
      setAddressError(null);
    }

    // Validate date of issue
    const doi = new Date(idCardData.dateOfIssue);
    if (doi > today) {
      setDateOfIssueError('Invalid date of issue');
      valid = false;
    } else {
      setDateOfIssueError(null);
    }

    // Validate height
    if (!idCardData.height) {
      setHeightError('Height is required');
      valid = false;
    } else {
      setHeightError(null);
    }
    // Validate nationality
    if (!idCardData.nationality) {
      setNationalityError('Nationality is required');
      valid = false;
    } else {
      setNationalityError(null);
    }

    // Validate eye color
    if (!idCardData.eyeColor) {
      setEyeError('Eye color is required');
      valid = false;
    } else {
      setEyeError(null);
    }

    return valid;
  };

  const handleFormSubmit = async () => {
    try {
      setLoadingButton(true);

      if (validateForm()) {
        console.log('Calling createIDCard...');
        const dateOfBirth = new Date(idCardData.dateOfBirth);
        await sdk.createIDCard(
          identityID,
          idCardData.phoneNumber,
          idCardData.nationality,
          dateOfBirth.getTime(),
          idCardData.identityCardNumber,
          idCardData.permanentAddress,
          idCardData.eyeColor,
          idCardData.height,
          new Date(idCardData.dateOfIssue).getTime(),
        );

        await getIdCardData();
      }
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoadingButton(false);
    }

    setLoadingData(false);
  };

  const getIdCardData = useCallback(async () => {
    setLoadingData(true);

    const idcardids = await sdk.getIDCardsIds();

    if (idcardids.length > 0) {
      const idcardPromises = idcardids.map(idCardId => sdk.getIDCardData(idCardId));
      const idcards = await Promise.all(idcardPromises);

      const foundIdCard =
        idcards.find(idcard => idcard.identityID === Number(identityID) && idcard.status === 1) ||
        {};

      setidcardPending(Object.keys(foundIdCard).length > 0);
    }

    setLoadingData(false);
  }, [sdk, identityID]);

  useEffect(() => {
    const checkBalance = async () => {
      try {
        const balance = await sdk.docItemContract.balanceOf(sdk.currentUser);
        setHasUserIdentity(Number(balance.toString()) > 0);

        if (Number(balance.toString()) > 0) {
          const tokenId = await sdk.docItemContract.tokenOfOwnerByIndex(sdk.currentUser, 0);
          const tokenURI = await sdk.docItemContract.tokenURI(tokenId);
          const metadata = await sdk.getTokenMetadataByURI(tokenURI);
          setidentityID(tokenId);
          setUserIdentity({
            ...metadata,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingData(false);
      }
    };

    sdk && sdk.currentUser && checkBalance();
  }, [sdk]);

  useEffect(() => {
    sdk && getIdCardData();
  }, [sdk, getIdCardData]);

  return (
    <div className="container my-5 py-6">
      <div className="row">
        <div className="col-6 offset-3">
          <h1>Create your ID card</h1>

          {loadingData ? (
            <p className="text-center my-5">Loading...</p>
          ) : hasUserIdentity ? (
            idcardPending ? (
              <p className="alert alert-info my-6">Wait for the Admin to approve</p>
            ) : (
              <div className="mt-5">
                {Object.keys(userIdentity).length > 0 ? (
                  <div className="row">
                    <div className="col-4">
                      <img className="img-fluid" src={userIdentity.imageUrl} alt="" />
                    </div>
                    <div className="col-8">
                      <h2>{userIdentity.name}</h2>
                      <p>{userIdentity.egn}</p>
                      {idcardPending ? (
                        <p>Your ID card is pending approval from the admin.</p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                <hr className="my-4" />
                <form onSubmit={handleFormSubmit}>
                  <div className="form-group mt-5">
                    <label htmlFor="phoneNumber">Phone number</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={idCardData.phoneNumber}
                      onChange={handleInputChange}
                      pattern="[0-9]{10}"
                      title="Phone number must be 10 digits"
                      required
                    />
                    {phoneNumberError && <span className="text-danger">{phoneNumberError}</span>}
                  </div>

                  <div className="form-group mt-4">
                    <label htmlFor="nationality">Nationality</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nationality"
                      name="nationality"
                      value={idCardData.nationality}
                      onChange={handleInputChange}
                      required
                    />
                    {nationalityError && <div className="text-danger">{nationalityError}</div>}
                  </div>

                  <div className="form-group mt-4">
                    <label htmlFor="dateOfBirth">Date of birth</label>
                    <input
                      type="date"
                      className="form-control"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={idCardData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                    {dateOfBirthError && <div className="text-danger">{dateOfBirthError}</div>}
                  </div>

                  <div className="form-group mt-4">
                    <label htmlFor="identityCardNumber">Identity card number</label>
                    <input
                      type="text"
                      className="form-control"
                      id="identityCardNumber"
                      name="identityCardNumber"
                      value={idCardData.identityCardNumber}
                      onChange={handleInputChange}
                      pattern="[0-9]{10}"
                      title="Identity card number must be 10 digits"
                      required
                    />
                    {identityCardNumberError && (
                      <span className="text-danger">{identityCardNumberError}</span>
                    )}
                  </div>

                  <div className="form-group mt-4">
                    <label htmlFor="permanentAddress">Permanent address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="permanentAddress"
                      name="permanentAddress"
                      value={idCardData.permanentAddress}
                      onChange={handleInputChange}
                    />
                    {addressError && <span className="text-danger">{addressError}</span>}
                  </div>

                  <div className="form-group mt-4">
                    <label htmlFor="eyeColor">Eye color</label>
                    <input
                      type="text"
                      className="form-control"
                      id="eyeColor"
                      name="eyeColor"
                      value={idCardData.eyeColor}
                      onChange={handleInputChange}
                      required
                    />
                    {eyeError && <div className="text-danger">{eyeError}</div>}
                  </div>

                  <div className="form-group mt-4">
                    <label htmlFor="height">Height(cm)</label>
                    <input
                      type="text"
                      className="form-control"
                      id="height"
                      name="height"
                      value={idCardData.height}
                      onChange={handleInputChange}
                      required
                    />
                    {heightError && <div className="text-danger">{heightError}</div>}
                  </div>

                  <div className="form-group mt-4">
                    <label htmlFor="dateOfIssue">Date of issue</label>
                    <input
                      type="date"
                      className="form-control"
                      id="dateOfIssue"
                      name="dateOfIssue"
                      value={idCardData.dateOfIssue}
                      onChange={handleInputChange}
                      required
                    />
                    {dateOfIssueError && <div className="text-danger">{dateOfIssueError}</div>}
                  </div>
                </form>

                <div className="text-center mt-4">
                  <Button loading={loadingButton} onClick={handleFormSubmit}>
                    Create
                  </Button>
                </div>
              </div>
            )
          ) : (
            <div className="alert alert-info my-5">Please create identity first</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDcard;
