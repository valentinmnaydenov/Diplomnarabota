import React from 'react';
import useProvider from '../../hooks/useProvider';

function Header() {
  const provider = useProvider();

  return (
    <div className="header-wrapper">
      <div className="header">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <a class="btn btn-primary m-1" href="/" role="button">
              Home
            </a>
            <a class="btn btn-primary m-1" href="/mint" role="button">
              Mint
            </a>
            <a class="btn btn-primary m-1" href="/profile" role="button">
              Profile
            </a>

            <p>{provider ? <code>{provider.signerData.userAddress}</code> : 'Not connected'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
