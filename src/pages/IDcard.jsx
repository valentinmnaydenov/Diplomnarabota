import React, { useState, useEffect, useCallback } from 'react';

const IDcard = ({ sdk }) => {
  const [forms, setForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(false);

  const getApplicationForms = useCallback(async () => {
    if (!sdk) return;

    setLoadingForms(true);

    const formIds = await sdk.getApplicationFormsIds();
    if (formIds.length > 0) {
      const latestFormId = formIds[formIds.length - 1];
      console.log(latestFormId);
      const formData = await sdk.getApplicationFormData(latestFormId);
      const formStatus = await sdk.approveApplicationForm(latestFormId);

      if (formStatus === 'rejected') {
        console.error('Form rejected');
        return;
      }
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
              <input type="text" className="form-control" id="phoneNumber" />
            </div>
            <div className="form-group">
              <label htmlFor="nationality">Nationality</label>
              <input type="text" className="form-control" id="nationality" />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of birth</label>
              <input type="text" className="form-control" id="dateOfBirth" />
            </div>
            <div className="form-group">
              <label htmlFor="identityCardNumber">Identity card number</label>
              <input type="text" className="form-control" id="identityCardNumber" />
            </div>
            <div className="form-group">
              <label htmlFor="permanentAddress">Permanent address</label>
              <input type="text" className="form-control" id="permanentAddress" />
            </div>
            <div className="form-group">
              <label htmlFor="eyeColor">Eye color</label>
              <input type="text" className="form-control" id="eyeColor" />
            </div>
            <div className="form-group">
              <label htmlFor="height">Height</label>
              <input type="text" className="form-control" id="height" />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfIssue">Date of issue</label>
              <input type="text" className="form-control" id="dateOfIssue" />
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
