import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';

const IDcard = ({ sdk }) => {
  const [loadingData, setLoadingData] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [hasUserIdentity, setHasUserIdentity] = useState(false);

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
  });

  const handleIDCardChange = e => {
    setIdCardData({ ...idCardData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async () => {
    setLoadingButton(true);

    try {
      await sdk.createIDCard(
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
    } catch (e) {
      console.log('e', e);
    } finally {
      setLoadingButton(false);
    }

    setLoadingData(false);
  };

  useEffect(() => {
    const checkBalance = async () => {
      try {
        const balance = await sdk.docItemContract.balanceOf(sdk.currentUser);
        setHasUserIdentity(Number(balance.toString()) > 0);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingData(false);
      }
    };

    sdk && sdk.currentUser && checkBalance();
  }, [sdk]);

  return (
    <div className="container py-5">
      <h1>Create your ID card</h1>

      {loadingData ? (
        <p className="text-center">Loading...</p>
      ) : hasUserIdentity ? (
        <div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone number</label>
            <input
              onChange={handleIDCardChange}
              type="text"
              className="form-control"
              id="phoneNumber"
            />
          </div>
          <div className="form-group">
            <label htmlFor="nationality">Nationality</label>
            <input
              onChange={handleIDCardChange}
              type="text"
              className="form-control"
              id="nationality"
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of birth</label>
            <input
              onChange={handleIDCardChange}
              type="text"
              className="form-control"
              id="dateOfBirth"
            />
          </div>
          <div className="form-group">
            <label htmlFor="identityCardNumber">Identity card number</label>
            <input
              onChange={handleIDCardChange}
              type="text"
              className="form-control"
              id="identityCardNumber"
            />
          </div>
          <div className="form-group">
            <label htmlFor="permanentAddress">Permanent address</label>
            <input
              onChange={handleIDCardChange}
              type="text"
              className="form-control"
              id="permanentAddress"
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
            <label htmlFor="height">Height</label>
            <input onChange={handleIDCardChange} type="text" className="form-control" id="height" />
          </div>
          <div className="form-group">
            <label htmlFor="dateOfIssue">Date of issue</label>
            <input
              onChange={handleIDCardChange}
              type="text"
              className="form-control"
              id="dateOfIssue"
            />
          </div>

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
