import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/ui/Button';

const IDCardAdmin = ({ sdk }) => {
  const [idCards, setIdCards] = useState([]);
  const [loadingIdCards, setLoadingIdCards] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [owner, setOwner] = useState('');

  const getIDCards = useCallback(async () => {
    setLoadingIdCards(true);

    const idCardIds = await sdk.getIDCardsIds();

    if (idCardIds.length > 0) {
      const idCardPromises = idCardIds.map(async idCardId => {
        const idCard = await sdk.getIDCardData(idCardId);
        let metadata = {};

        try {
          const tokenURI = await sdk.docItemContract.tokenURI(idCard.identityID);
          metadata = await sdk.getTokenMetadataByURI(tokenURI);
        } catch (error) {
          console.log(error);
        } finally {
          setLoadingIdCards(false);
          return {
            ...idCard,
            name: metadata?.name,
            imageUrl: metadata?.imageUrl,
            egn: metadata?.egn,
          };
        }
      });
      const idCards = await Promise.all(idCardPromises);
      setIdCards(idCards);
    }

    setLoadingIdCards(false);
  }, [sdk]);

  useEffect(() => {
    sdk && getIDCards();
  }, [sdk, getIDCards]);

  const getOwner = useCallback(async () => {
    const ownerAddress = await sdk.getOwner();
    setOwner(ownerAddress);
  }, [sdk]);

  useEffect(() => {
    sdk && getIDCards();
    sdk && getOwner();
  }, [sdk, getIDCards, getOwner]);

  const handleApproveIdcard = async idCardId => {
    setButtonLoading(true);
    try {
      await sdk.approveIDCard(idCardId);
      getIDCards();
    } catch (error) {
      console.error(error);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleRejectIdcard = async idCardId => {
    setButtonLoading(true);
    try {
      await sdk.rejectIDcard(idCardId);
      getIDCards();
    } catch (error) {
      console.error(error);
    } finally {
      setButtonLoading(false);
    }
  };

  const statusArray = ['Approved', 'Pending', 'Rejected'];

  return (
    <div className="container my-5 py-6">
      {sdk && owner === sdk.currentUser ? (
        <>
          <h1 className="mb-6">ID card Applications</h1>
          {loadingIdCards ? (
            <p className="text-center">Loading...</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>EGN</th>
                  <th>Photo</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                  <th>Nationality</th>
                  <th>DateofBirth</th>
                  <th>Id</th>
                  <th>Adress</th>
                  <th>EyeColor</th>
                  <th>Height</th>
                  <th>Dateofissue</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              {idCards.length > 0 ? (
                <tbody>
                  {idCards.map(idCard => (
                    <tr key={idCard.id}>
                      <td>{idCard.name || '-'}</td>
                      <td>{idCard.egn || '-'}</td>
                      <td>
                        <img src={idCard.imageUrl} alt="" width="100" />
                      </td>
                      <td>{idCard.phoneNumber}</td>
                      <td>{statusArray[idCard.status]}</td>
                      <td>{idCard.nationality}</td>
                      <td>{new Date(Number(idCard.dateOfBirth)).toLocaleDateString()}</td>
                      <td>{idCard.identityCardNumber}</td>
                      <td>{idCard.permanentAddress}</td>
                      <td>{idCard.eyeColor}</td>
                      <td>{idCard.height}</td>
                      <td>{new Date(Number(idCard.dateOfIssue)).toLocaleDateString()}</td>
                      {/* <td>{Object.keys(userIdentity).length > 0 ? userIdentity.documentType : '-'}</td> */}

                      <td>
                        {idCard.status === 1 ? (
                          <div className="d-flex justify-content-end">
                            <Button
                              loading={buttonLoading}
                              className="btn btn-success me-3"
                              onClick={() => handleApproveIdcard(idCard.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              loading={buttonLoading}
                              className="btn btn-danger"
                              onClick={() => handleRejectIdcard(idCard.id)}
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
        </>
      ) : (
        <div className="row">
          <div className="col-6 offset-3">
            <div className="alert alert-warning text-center">Only admin can access this page</div>
          </div>
        </div>
      )}
    </div>
  );
};
export default IDCardAdmin;
