import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from '../pages/Home';
import Mint from '../pages/Mint';
import Profile from '../pages/Profile';
import Collection from '../pages/Collection';
import Styleguide from '../pages/Styleguide';
import Deposit from '../pages/Deposit';

import Header from './layout/Header';
import Footer from './layout/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="wrapper">
        <Header />
        <div className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="styleguide" element={<Styleguide />} />
            
            <Route path="mint" element={<Mint />} />
            <Route path="profile" element={<Profile />} />
            <Route path="collection" element={<Collection />} />

          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
