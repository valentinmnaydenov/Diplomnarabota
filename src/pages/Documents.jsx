import React, { useState, useEffect, useCallback } from 'react';

const Documents = ({ sdk }) => {
  const [forms, setForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(false);

  const getApplicationForms = useCallback(async () => {
    if (!sdk) return;

    setLoadingForms(true);

    const formIds = await sdk.getApplicationFormsIds();

    // Check if there are some forms
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

<<<<<<< HEAD
  const handleApproveForm = async formId => {
    try {
      await sdk.approveApplicationForm(formId);
      console.log(
        'Form before update:',
        forms.find(form => form.id === formId),
      );
      const updatedForms = forms.map(form => {
        if (form.id === formId) {
          return { ...form, status: 'approved' };
        }
        return form;
      });
      setForms(updatedForms);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectForm = async formId => {
    try {
      await sdk.rejectApplicationForm(formId);
      console.log(
        'Form before update:',
        forms.find(form => form.id === formId),
      );
      const updatedForms = forms.map(form => {
        if (form.id === formId) {
          return { ...form, status: 'rejected' };
        }
        return form;
      });
      setForms(updatedForms);
    } catch (error) {
      console.error(error);
    }
  };
=======
  console.log(forms);
>>>>>>> 843702e4c8429e3f31e9f252ca3bdfabdb87fbc7

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
<<<<<<< HEAD
              <th>Actions</th>
=======
>>>>>>> 843702e4c8429e3f31e9f252ca3bdfabdb87fbc7
            </tr>
          </thead>
          {forms.length > 0 ? (
            <tbody>
              {forms.map(form => (
                <tr key={form.id}>
                  <td>{form.name}</td>
                  <td>{form.egn}</td>
<<<<<<< HEAD
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
                    {form.status === undefined && (
                      <>
                        <button
                          className="btn btn-success mr-2"
                          onClick={() => handleApproveForm(form.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleRejectForm(form.id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
=======
                  <td>{form.status}</td>
                  <td>
                    <img src={form.imageUrl} alt="" />
>>>>>>> 843702e4c8429e3f31e9f252ca3bdfabdb87fbc7
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
