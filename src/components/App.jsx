import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import useProvider from '../hooks/useProvider';
import SDK from '../sdk/index';

import Home from '../pages/Home';
import ApplicationForm from '../pages/ApplicationForm';
import Documents from '../pages/Documents';
import IDcard from '../pages/IDcard';
import Profile from '../pages/Profile';
import IDCardAdmin from '../pages/IDCardAdmin';

import Header from './layout/Header';
import Footer from './layout/Footer';

function App() {
  const provider = useProvider();
  const [sdk, setSdk] = useState();

  useEffect(() => {
    const getSDK = async () => {
      const _sdk = new SDK(provider);
      await _sdk.initContracts();
      setSdk(_sdk);
    };

    provider && getSDK();
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
            <Route path="idcard" element={<IDcard sdk={sdk} />} />
            <Route path="idcardadmin" element={<IDCardAdmin sdk={sdk} />} />
            <Route path="profile" element={<Profile sdk={sdk} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
