import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from '../pages/Home';
import Styleguide from '../pages/Styleguide';
import Documents from '../pages/Documents';
import useProvider from '../hooks/useProvider';
import SDK from '../sdk/index';

//import Documenttype from '../pages/Documenttype'

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
      console.log(_sdk);
    }
  }, [provider]);
  return (
    <BrowserRouter>
      <div className="wrapper">
        <Header />
        <div className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/" element={<Documents />} />
            <Route path="styleguide" element={<Styleguide sdk={sdk} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
