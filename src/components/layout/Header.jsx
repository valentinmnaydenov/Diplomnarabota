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
            <div className="d-flex">
              <Link className="link me-4" to="/" role="button">
                Home
              </Link>
              <Link className="link me-4" to="/documents" role="button">
                Documents
              </Link>
              <Link className="link me-4" to="/idcard" role="button">
                IDcard
              </Link>
              <Link className="link me-4" to="/idcardadmin" role="button">
                IDCardAdmin
              </Link>
            </div>

            <p>{provider ? <code>{provider.signerData.userAddress}</code> : 'Not connected'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
