import React, { useState, useEffect, useCallback } from 'react';
// import QRCode from 'react-qr-code';

const Profile = ({ sdk }) => {
  const [metadataAvailable, setMetadataAvailable] = useState(false);
  const [idCards, setIdCards] = useState([]);
  const [loadingIdCards, setLoadingIdCards] = useState(false);
  const [identityID, setidentityID] = useState('');

  const getIDCards = useCallback(async () => {
    if (!sdk) return;

    setLoadingIdCards(true);

    const idCardIds = await sdk.getIDCardsIds();

    if (idCardIds.length > 0) {
      const idCardPromises = idCardIds.map(async idCardId => {
        const idCard = await sdk.getIDCardData(idCardId);
        let metadata = {};

        try {
          const tokenId = await sdk.docItemContract.tokenOfOwnerByIndex(sdk.currentUser, 0);
          const tokenURI = await sdk.docItemContract.tokenURI(tokenId);
          metadata = await sdk.getTokenMetadataByURI(tokenURI);
          setMetadataAvailable(true);
          setidentityID(tokenId);
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
  }, [sdk, metadataAvailable]);

  useEffect(() => {
    sdk && getIDCards();
  }, [sdk, getIDCards]);

  return (
    <div className="container my-5 py-6">
      <h1 className="mb-6">Profile</h1>
      {loadingIdCards ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="id-card">
          <div className="id-card__header">
            <div className="id-card__photo">
              {idCards.length > 0 && idCards[0].imageUrl ? (
                <img src={idCards[0].imageUrl} alt="ID card photo" />
              ) : (
                <div className="id-card__photo-placeholder"></div>
              )}
            </div>
            <div className="id-card__info">
              <div className="id-card__name">
                {idCards[0] && idCards[0].name ? idCards[0].name : '-'}
              </div>
              <div className="id-card__id-number">
                : {idCards[0] && idCards[0].egn ? idCards[0].egn : '-'}
              </div>
              <div className="id-card__issued">
                Issued:{' '}
                {new Date(
                  Number(idCards[0] && idCards[0].dateOfIssue ? idCards[0].dateOfIssue : '-'),
                ).toLocaleDateString() || '-'}
              </div>
            </div>
          </div>
          <div className="id-card__body">
            <div className="id-card__field">
              <div className="id-card__field-label">Date of Birth:</div>
              <div className="id-card__field-value">
                {new Date(
                  Number(idCards[0] && idCards[0].dateOfBirth ? idCards[0].dateOfBirth : '-'),
                ).toLocaleDateString() || '-'}
              </div>
            </div>
            <div className="id-card__field">
              <div className="id-card__field-label">Nationality:</div>
              <div className="id-card__field-value">
                {idCards[0] && idCards[0].nationality ? idCards[0].nationality : '-'}
              </div>
            </div>
            <div className="id-card__field">
              <div className="id-card__field-label">Address:</div>
              <div className="id-card__field-value">
                {idCards[0] && idCards[0].permanentAddress ? idCards[0].permanentAddress : '-'}
              </div>
            </div>
            <div className="id-card__field">
              <div className="id-card__field-label">Eye Color:</div>
              <div className="id-card__field-value">
                {idCards[0] && idCards[0].eyeColor ? idCards[0].eyeColor : '-'}
              </div>
            </div>
            <div className="id-card__field">
              <div className="id-card__field-label">Height:</div>
              <div className="id-card__field-value">
                {idCards[0] && idCards[0].height ? idCards[0].height : '-'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Profile;
