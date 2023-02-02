import React from 'react';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ApplicationForm from './ApplicationForm';

const Documents = ({ sdk }) => {
  // const [forms, setForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [Forms, setApplicationForms] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const params = useParams();
  const hasParams = Object.keys(params).length > 0;

  useEffect(() => {
    const getApplicationForm = async () => {
      setLoadingForms(true);

      const applicatonformIds = await sdk.getApplicationForm();
      const promisesApplicationS = applicatonformIds.map(id => sdk.getApplicationFormData(id));
      const ApplicationForm = await Promise.all(promisesApplicationS);

      const filterId = hasParams ? Number(params.id) : null;
      const filtered = ApplicationForm.filter(
        form => form.applicationData.applicationformId === filterId,
      );

      const { name: ApplicationName } = ApplicationForm.find(
        form => form.applicationformId === filterId,
      );
      setApplicationData({ ApplicationName });
      setApplicationForms(filtered);
    };
    getApplicationForm();
  }, [sdk, fetchAgain, hasParams, params.id]);

  const renderItems = () => {
    return Forms.map((form, index) => {
      return (
        <div className="col-md-6 col-lg-4 col-xl-3 mt-4" key={index}>
          {/* <Card type="home" item={item} buyItem={buyItem} /> */}
        </div>
      );
    });

    const show = !loadingForms;
    const hasForms = Forms.length > 0;
  };

  return (
    <div>
      <h1>Documents Page</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>EGN</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {ApplicationForm.map(form => (
            <tr key={form.id}>
              <td>{form.name}</td>
              <td>{form.egn}</td>
              <td>{form.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Documents;
