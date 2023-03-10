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
              <Link className="link me-4" to="/application-form" role="button">
                Create identity
              </Link>
              <Link className="link" to="/idcard" role="button">
                Apply for ID card
              </Link>
              <span className="mx-4">|</span>
              <Link className="link me-4" to="/documents" role="button">
                Identity Applications
              </Link>
              <Link className="link me-4" to="/idcardadmin" role="button">
                ID Card Applications
              </Link>
            </div>

            <div className="d-flex">
              <p>{provider ? <code>{provider.signerData.userAddress}</code> : 'Not connected'}</p>
              {provider ? (
                <Link className="link ms-4" to="/profile" role="button">
                  My Profile
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
