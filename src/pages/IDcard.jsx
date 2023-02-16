import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';

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

  const handleFormSubmit = async () => {
    setLoadingButton(true);
    if (validateForm()) {
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

  const validateForm = () => {
    let hasError = false;
    if (!/^\d{10}$/.test(idCardData.phoneNumber)) {
      setPhoneNumberError('Phone number must be 10 digits');
      hasError = true;
    } else {
      setPhoneNumberError(null);
    }
    if (!/^\d{2}-\d{2}-\d{4}$/.test(idCardData.dateOfBirth)) {
      setDateOfBirthError('Date of birth must be in the format -DD-YYYY');
      hasError = true;
    } else {
      const birthDate = new Date(idCardData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        setDateOfBirthError('You must be at least 18 years old');
        hasError = true;
      } else {
        setDateOfBirthError(null);
      }
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
      return !hasError;
    }
    if (!/^\d+(\.\d+)?cm$/.test(idCardData.height)) {
      setHeightError('Please enter a valid height in cm.');
    } else {
      setHeightError('');
    }
    return !hasError;
  };

  console.log(idCardData);
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
