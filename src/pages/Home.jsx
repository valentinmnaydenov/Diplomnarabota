import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useState} from 'react';


const Home = ({ sdk }) => {
  const [docItems, setDocItems] = useState([]);
  const [generalError, setGeneralError] = useState(false);
  const [generalErrorMessage, setGeneralErrorMessage] = useState('');
  const [loadingItems, setLoadingItems] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    const getDocItems = async () => {
      setLoadingItems(true);


      const ids = await sdk.getDocItemsIds();
      const promises = ids.map(id => sdk.getDocItemData(id,));
      const items = await Promise.all(promises);

      setDocItems(items);
      setLoadingItems(false);
    };

    getDocItems();
  }, [sdk, fetchAgain]);



  return (
    <div className="container my-5" >
      <h1 align="middle">This is my ID Wallet</h1>
      <p className="mt-3" align="middle">
        Opinionated minimal boilerplate for starting React projects with Bootstrap and couple more
        goodies.
      </p>
      <p className="mt-2" align="middle">
       You can use this DDapp to create documents like ID,Passport,CarLicense
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
