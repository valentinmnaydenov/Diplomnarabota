import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import { useCallback } from 'react';

const IDcard = ({ sdk }) => {
  const [loadingData, setLoadingData] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [hasUserIdentity, setHasUserIdentity] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(null);
  const [dateOfBirthError, setDateOfBirthError] = useState(null);
  const [identityCardNumberError, setIdentityCardNumberError] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [dateOfIssueError, setDateOfIssueError] = useState(null);
  const [height, setHeight] = useState('');
  const [heightError, setHeightError] = useState('');
  const [userIdentity, setUserIdentity] = useState({});
  const [identityID, setidentityID] = useState('');
  const [idcardPending, setidcardPending] = useState(false);
  const [loadingCards, setLoadingCards] = useState(true);

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

  const handleIDCardChange = e => {
    setIdCardData({ ...idCardData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let hasError = false;
    if (!/^\d{10}$/.test(idCardData.phoneNumber)) {
      setPhoneNumberError('Phone number must be 10 digits');
      hasError = true;
    } else {
      setPhoneNumberError(null);
    }

    if (!/^\d{9}$/.test(idCardData.identityCardNumber)) {
      setIdentityCardNumberError('Identity card number must be 9 digits');
      hasError = true;
    } else {
      setIdentityCardNumberError(null);
    }

    if (!/^\w+\s+\w+,\s+\d+$/.test(idCardData.permanentAddress)) {
      setAddressError('Address must be in the format "Street Name, Town, Postal Code"');
      hasError = true;
    } else {
      setAddressError(null);
    }

    if (!/^\d{2}-\d{2}-\d{4}$/.test(idCardData.dateOfIssue)) {
      setDateOfIssueError('Date of birth must be in the format DD-MM-YYYY');
      hasError = true;
    } else {
      setDateOfIssueError(null);
    }

    return !hasError;
  };

  const handleFormSubmit = async () => {
    if (!sdk) {
      console.log('sdk object is undefined. Aborting createIdcard call.');
      return;
    }

    try {
      setLoadingButton(true);

      console.log('Calling getIDCardsIds...');
      const idCardIds = await sdk.getIDCardsIds();
      console.log('getIDCardsIds result:', idCardIds);

      const pendingIdCard = idCardIds.find(
        idCardId => idCardId.user === sdk.currentUser && idCardId.status === 'pending',
      );

      if (pendingIdCard) {
        console.log('There is a pending ID card. Aborting createIdcard call.');
        return;
      }

      if (validateForm()) {
        console.log('Calling createIDCard...');
        await sdk.createIDCard(
          identityID,
          idCardData.id,
          idCardData.phoneNumber,
          idCardData.nationality,
          idCardData.dateOfBirth,
          idCardData.identityCardNumber,
          idCardData.permanentAddress,
          idCardData.eyeColor,
          idCardData.height,
          idCardData.dateOfIssue,
        );
        console.log('createIDCard call completed.');
      }
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoadingButton(false);
    }

    setLoadingData(false);
  };

  const getIdCardData = useCallback(async () => {
    if (!sdk) {
      console.log('SDK is not available');
      return;
    }
    setLoadingCards(true);

    const idcardids = await sdk.getIDCardsIds();

    if (idcardids.length > 0) {
      const idcardPromises = idcardids.map(idCardId => sdk.getIDCardData(idCardId));
      const idcards = await Promise.all(idcardPromises);

      const foundIdCard =
        idcards.find(idcard => idcard.user === sdk.currentUser && idcard.status === 1) || {};

      setidcardPending(Object.keys(foundIdCard).length > 0);
    }

    setLoadingCards(false);
  }, [sdk]);

  useEffect(() => {
    const checkBalance = async () => {
      console.log('checkBalance called');
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
    console.log('useEffect called');
    sdk && getIdCardData();
  }, [sdk, getIdCardData]);

  return (
    <div className="container my-5 py-6">
      <h1>Create your ID card</h1>
      {loadingData ? (
        <p className="text-center my-5">Loading...</p>
      ) : hasUserIdentity ? (
        <div className="mt-5">
          {Object.keys(userIdentity).length > 0 ? (
            <div className="row">
              <div className="col-4">
                <img className="img-fluid" src={userIdentity.imageUrl} alt="" />
              </div>
              <div className="col-8">
                <h2>{userIdentity.name}</h2>
                <p>{userIdentity.egn}</p>
                {idcardPending ? <p>Your ID card is pending approval from the admin.</p> : null}
              </div>
            </div>
          ) : null}
          <form onSubmit={handleFormSubmit}>
            <div className="form-group mt-5">
              <label htmlFor="phoneNumber">Phone number</label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                value={idCardData.phoneNumber}
                onChange={handleIDCardChange}
                pattern="[0-9]{10}"
                title="Phone number must be 10 digits"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="nationality">Nationality</label>
              <input
                type="text"
                className="form-control"
                id="nationality"
                name="nationality"
                value={idCardData.nationality}
                onChange={handleIDCardChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of birth</label>
              <input
                type="date"
                className="form-control"
                id="dateOfBirth"
                name="dateOfBirth"
                value={idCardData.dateOfBirth}
                onChange={handleIDCardChange}
                required
              />
              {dateOfBirthError && <div className="text-danger">{dateOfBirthError}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="identityCardNumber">Identity card number</label>
              <input
                type="text"
                className="form-control"
                id="identityCardNumber"
                name="identityCardNumber"
                value={idCardData.identityCardNumber}
                onChange={handleIDCardChange}
                pattern="[0-9]{10}"
                title="Identity card number must be 10 digits"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="permanentAddress">Permanent address</label>
              <input
                type="text"
                className="form-control"
                id="permanentAddress"
                name="permanentAddress"
                value={idCardData.permanentAddress}
                onChange={handleIDCardChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="eyeColor">Eye color</label>
              <input
                onChange={handleIDCardChange}
                type="text"
                className="form-control"
                id="eyeColor"
              />
            </div>
            <div className="form-group">
              <label htmlFor="height">Height(cm)</label>
              <input
                type="text"
                className="form-control"
                id="height"
                name="height"
                value={idCardData.height}
                onChange={handleIDCardChange}
                required
              />
              {heightError && <div className="text-danger">{heightError}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="dateOfIssue">Date of issue</label>
              <input
                type="date"
                className="form-control"
                id="dateOfIssue"
                name="dateOfIssue"
                value={idCardData.dateOfIssue}
                onChange={handleIDCardChange}
                required
              />
            </div>
          </form>

          <Button loading={loadingButton} onClick={handleFormSubmit} className="btn btn-primary">
            Create
          </Button>
        </div>
      ) : (
        <div className="alert alert-warnoing">Please create identity first</div>
      )}
    </div>
  );
};
export default IDcard;
