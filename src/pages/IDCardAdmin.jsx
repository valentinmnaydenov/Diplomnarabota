import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/ui/Button';

const IDCardAdmin = ({ sdk }) => {
  const [idCards, setIdCards] = useState([]);
  const [loadingIdCards, setLoadingIdCards] = useState(false);

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
};
export default IDCardAdmin;
