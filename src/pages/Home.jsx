import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container my-5" >
      <h1 align="middle">This is NFT Market Place</h1>
      <p className="mt-3" align="middle">
        Opinionated minimal boilerplate for starting React projects with Bootstrap and couple more
        goodies.
      </p>
      <p className="mt-2" align="middle">
       You can use this marketplace to create, buy & sell NFTs
      </p>
      <p className="mt-5" align="middle">
      Connect Your Wallet
      </p>
      <div className="mt-5">
        <Link to="/styleguide" className="btn btn-primary">
          Connect
        </Link>
      </div>
    </div>
  );
}

export default Home;
