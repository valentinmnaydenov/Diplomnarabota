import React, { useState, useEffect, useCallback } from 'react';

const Documents = ({ sdk }) => {
  const [forms, setForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(false);

  const getApplicationForms = useCallback(async () => {
    if (!sdk) return;

    setLoadingForms(true);

    const formIds = await sdk.getApplicationFormsIds();

    if (formIds.length > 0) {
      const formPromises = formIds.map(formId => sdk.getApplicationFormData(formId));
      const forms = await Promise.all(formPromises);

      setForms(forms);
    }

    setLoadingForms(false);
  }, [sdk]);

  useEffect(() => {
    sdk && getApplicationForms();
  }, [sdk, getApplicationForms]);

  const handleApproveForm = async formId => {
    try {
      await sdk.approveApplicationForm(formId);
      const updatedForm = await sdk.getApplicationFormData(formId);
      console.log(
        'Form before update:',
        forms.find(form => form.id === formId),
      );
      const updatedForms = forms.filter(form => form.id !== formId);
      setForms(updatedForms);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectForm = async formId => {
    try {
      await sdk.rejectApplicationForm(formId);
      const updatedForm = await sdk.getApplicationFormData(formId);

      const updatedForms = forms.filter(form => form.id !== formId || form.status !== 'rejected');
      setForms(updatedForms);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredForms = forms.filter(form => form.status === 'approved');

  return (
    <div className="container py-5">
      <h1>Documents Page</h1>
      {loadingForms ? (
        <p className="text-center">Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>EGN</th>
              <th>Status</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          {forms.length > 0 ? (
            <tbody>
              {forms
                .filter(form => form.status !== 0)
                .map(form => (
                  <tr key={form.id}>
                    <td>{form.name}</td>
                    <td>{form.egn}</td>
                    <td>
                      {typeof form.status === 'string'
                        ? form.status === 'approved'
                          ? 'Approved'
                          : form.status === 'rejected'
                          ? 'Rejected'
                          : 'Pending'
                        : form.status === 0
                        ? 'Approved'
                        : form.status === 2
                        ? 'Rejected'
                        : 'Pending'}
                    </td>
                    <td>
                      <img src={form.imageUrl} alt="" style={{ height: '100px', width: '100px' }} />
                    </td>
                    <td>
                      <button
                        className="btn btn-success mr-2"
                        onClick={() => handleApproveForm(form.id)}
                      >
                        Approve
                      </button>
                      <button className="btn btn-danger" onClick={() => handleRejectForm(form.id)}>
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          ) : null}
        </table>
      )}
    </div>
  );
};
export default Documents;
