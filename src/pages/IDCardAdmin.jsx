import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/ui/Button';

const IDCardAdmin = ({ sdk }) => {
  const [idCards, setIdCards] = useState([]);
  const [loadingIdCards, setLoadingIdCards] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const getIDCards = useCallback(async () => {
    if (!sdk) return;

    setLoadingIdCards(true);

    const idCardIds = await sdk.getIDCardsIds();

    if (idCardIds.length > 0) {
      const idCardPromises = idCardIds.map(idCardId => sdk.getIDCardData(idCardId));
      const idCards = await Promise.all(idCardPromises);

      setIdCards(idCards);
    }

    setLoadingIdCards(false);
  }, [sdk]);

  useEffect(() => {
    sdk && getIDCards();
  }, [sdk, getIDCards]);

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
};
export default IDCardAdmin;
