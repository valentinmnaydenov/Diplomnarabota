import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function SuccessPage() {
  const location = useLocation();

  useEffect(() => {
    if (!location.state || !location.state.isMinted) {

      window.location.href = '/styleguide';
    }
  }, [location]);

  return (
    <div>
      <h1>Success!</h1>
      <p>Your NFT has been minted.</p>
    </div>
  );
}

export default SuccessPage;
