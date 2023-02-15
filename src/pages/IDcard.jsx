import React, { useState, useEffect, useCallback } from 'react';

const IDcard = ({ sdk }) => {
  const [forms, setForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(null);
  const [dateOfBirthError, setDateOfBirthError] = useState(null);
  const [identityCardNumberError, setIdentityCardNumberError] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [dateOfIssueError, setDateOfIssueError] = useState(null);
  const [height, setHeight] = useState('');
  const [heightError, setHeightError] = useState('');

  const getApplicationForms = useCallback(async () => {
    if (!sdk) return;

    setLoadingForms(true);

    const formIds = await sdk.getApplicationFormsIds();
    if (formIds.length > 0) {
      const latestFormId = formIds[formIds.length - 1];
      console.log(latestFormId);
      const formData = await sdk.getApplicationFormData(latestFormId);
      // const formStatus = await sdk.approveApplicationForm(latestFormId);

      if (formData) {
        const currentShape = formData;
        setForms([currentShape]);
      }
    }

    setLoadingForms(false);
  }, [sdk]);

  useEffect(() => {
    sdk && getApplicationForms();
  }, [sdk, getApplicationForms]);

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
  const [loadingIDCard, setLoadingIDCard] = useState(false);

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
    if (!/^\d{2}-\d{2}-\d{4}$/.test(idCardData.dateOfBirth)) {
      setDateOfBirthError('Date of birth must be in the format DD-MM-YYYY');
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
  };

  const saveIDCard = useCallback(async () => {
    if (!sdk) return;

    setLoadingIDCard(true);

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

    setLoadingIDCard(false);
  }, [sdk, idCardData]);

  return (
    <div className="container py-5">
      <h1>Create your ID card</h1>
      {loadingForms ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>EGN</th>
                <th>Image</th>
              </tr>
            </thead>
            {forms.length > 0 ? (
              <tbody>
                {forms.map(form => (
                  <tr key={form.id}>
                    <td>{form.name}</td>
                    <td>{form.egn}</td>
                    <td>
                      <img src={form.imageUrl} alt="" style={{ height: '100px', width: '100px' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : null}
          </table>
          <hr />
          <form>
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
              <input type="text" className="form-control" id="eyeColor" />
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
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default IDcard;
