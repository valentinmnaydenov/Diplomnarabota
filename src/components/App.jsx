import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import useProvider from '../hooks/useProvider';
import SDK from '../sdk/index';

import Home from '../pages/Home';
import ApplicationForm from '../pages/ApplicationForm';
import Documents from '../pages/Documents';
import IDcard from '../pages/IDcard';

import Header from './layout/Header';
import Footer from './layout/Footer';

function App() {
  const provider = useProvider();
  const [sdk, setSdk] = useState();

  useEffect(() => {
    if (provider) {
      const _sdk = new SDK(provider);
      _sdk.initContracts();
      setSdk(_sdk);
    }
  }, [provider]);

  return (
    <BrowserRouter>
      <div className="wrapper">
        <Header />
        <div className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="application-form" element={<ApplicationForm sdk={sdk} />} />
            <Route path="documents" element={<Documents sdk={sdk} />} />
<<<<<<< HEAD
            <Route path="idcard" element={<IDcard sdk={sdk} />} />
=======
>>>>>>> 843702e4c8429e3f31e9f252ca3bdfabdb87fbc7
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
