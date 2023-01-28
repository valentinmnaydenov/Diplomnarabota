import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ sdk }) => {
  return (
    <div className="container my-5">
      <div className="py-6">
        <h1>Decentralised Identity System</h1>
        <p className="mt-4">
          You can use this Dapp to create documents like ID, Passport, Car License
        </p>
        <div className="mt-3">
          <Link className="btn btn-primary" to="application-form">
            Start here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
