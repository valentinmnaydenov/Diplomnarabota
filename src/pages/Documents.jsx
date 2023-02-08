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

  console.log(forms);

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
            </tr>
          </thead>
          {forms.length > 0 ? (
            <tbody>
              {forms.map(form => (
                <tr key={form.id}>
                  <td>{form.name}</td>
                  <td>{form.egn}</td>
                  <td>{form.status}</td>
                  <td>
                    <img src={form.imageUrl} alt="" />
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
