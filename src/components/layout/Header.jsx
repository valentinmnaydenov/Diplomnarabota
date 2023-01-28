import React from 'react';
import { Link } from 'react-router-dom';
import useProvider from '../../hooks/useProvider';

function Header() {
  const provider = useProvider();

  return (
    <div className="header-wrapper">
      <div className="header">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <Link className="btn btn-primary m-1" to="/" role="button">
              Home
            </Link>

            <p>{provider ? <code>{provider.signerData.userAddress}</code> : 'Not connected'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
