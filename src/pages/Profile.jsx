import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
// import QRCode from 'react-qr-code';

const Profile = ({ sdk }) => {
  const [userIdentity, setUserIdentity] = useState({});
  const [userIDCard, setUserIDCard] = useState({});
  const [identityID, setidentityID] = useState('');
  const [loadingIdCards, setLoadingIdCards] = useState(true);

  const getIDCards = useCallback(async () => {
    const idcardids = await sdk.getIDCardsIds();

    if (idcardids.length > 0) {
      const idcardPromises = idcardids.map(idCardId => sdk.getIDCardData(idCardId));
      const idcards = await Promise.all(idcardPromises);

      const foundIdCard =
        idcards.find(idcard => idcard.identityID === Number(identityID) && idcard.status === 0) ||
        {};

      setUserIDCard(foundIdCard);
    }

    setLoadingIdCards(false);
  }, [sdk, identityID]);

  useEffect(() => {
    sdk && getIDCards();
  }, [sdk, getIDCards]);

  useEffect(() => {
    const checkBalance = async () => {
      try {
        const balance = await sdk.docItemContract.balanceOf(sdk.currentUser);

        if (Number(balance.toString()) > 0) {
          const tokenId = await sdk.docItemContract.tokenOfOwnerByIndex(sdk.currentUser, 0);
          const tokenURI = await sdk.docItemContract.tokenURI(tokenId);
          const metadata = await sdk.getTokenMetadataByURI(tokenURI);
          setidentityID(tokenId);
          setUserIdentity({
            ...metadata,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingIdCards(false);
      }
    };

    sdk && sdk.currentUser && checkBalance();
  }, [sdk]);

  return (
    <div className="container my-5 py-6">
      <h1 className="mb-6">Profile</h1>
      {loadingIdCards ? (
        <p className="text-center">Loading...</p>
      ) : Object.keys(userIdentity).length > 0 ? (
        <div className="row">
          <div className="col-4">
            <img className="img-fluid" src={userIdentity.imageUrl} alt="" />
          </div>
          <div className="col-8">
            <p className="mb-2">
              <span className="text-bold">Name:</span> {userIdentity.name}
            </p>
            <p className="mb-2">
              <span className="text-bold">EGN:</span> {userIdentity.egn}
            </p>
            {Object.keys(userIDCard).length > 0 ? (
              <>
                <hr className="my-4" />
                <div className="row">
                  <div className="col-6">
                    <p className="mb-2">
                      <span className="text-bold">ID card number:</span>{' '}
                      {userIDCard.identityCardNumber}
                    </p>
                    <p className="mb-2">
                      <span className="text-bold">Nationality:</span> {userIDCard.nationality}
                    </p>
                    <p className="mb-2">
                      <span className="text-bold">Address:</span> {userIDCard.permanentAddress}
                    </p>
                    <p className="mb-2">
                      <span className="text-bold">Phone number:</span> {userIDCard.phoneNumber}
                    </p>
                  </div>

                  <div className="col-6">
                    <p className="mb-2">
                      <span className="text-bold">Eye color:</span> {userIDCard.eyeColor}
                    </p>
                    <p className="mb-2">
                      <span className="text-bold">Height:</span> {userIDCard.height}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="alert alert-info">
                Please apply for ID card <Link to="/idcard">here</Link>.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="alert alert-info">
          Please apply for Identity <Link to="/application-form">here</Link>.
        </div>
      )}
    </div>
  );
};
export default Profile;
