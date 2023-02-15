import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/ui/Button';

const Documents = ({ sdk }) => {
  const [forms, setForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

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

  const handleApproveForm = async formId => {
    setButtonLoading(true);
    try {
      await sdk.approveApplicationForm(formId);
      getApplicationForms();
    } catch (error) {
      console.error(error);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleRejectForm = async formId => {
    setButtonLoading(true);
    try {
      await sdk.rejectApplicationForm(formId);
      getApplicationForms();
    } catch (error) {
      console.error(error);
    } finally {
      setButtonLoading(false);
    }
  };

  const statusArray = ['Approved', 'Pending', 'Rejected'];

  return (
    <div className="container my-5 py-6">
      <h1 className="mb-6">Documents Page</h1>
      {loadingForms ? (
        <p className="text-center">Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="text-end">EGN</th>
              <th>Status</th>
              <th>Image</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          {forms.length > 0 ? (
            <tbody>
              {forms.map(form => (
                <tr key={form.id}>
                  <td>{form.name}</td>
                  <td className="text-end">{form.egn}</td>
                  <td>{statusArray[form.status]}</td>
                  <td>
                    <img
                      className="img-fluid"
                      src={form.imageUrl}
                      alt=""
                      style={{ height: '50px', width: '50px' }}
                    />
                  </td>
                  <td>
                    {form.status === 1 ? (
                      <div className="d-flex justify-content-end">
                        <Button
                          loading={buttonLoading}
                          className="btn btn-success me-3"
                          onClick={() => handleApproveForm(form.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          loading={buttonLoading}
                          className="btn btn-danger"
                          onClick={() => handleRejectForm(form.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : null}
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
