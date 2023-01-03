import React from 'react';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import useProvider from '../hooks/useProvider';
import walletABI from '../sdk/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';
import Button from '../components/ui/Button';

function Collection() {
  const providerData = useProvider();
  const [contract, setContract] = useState();

  const [collectionName, setCollectionName]  =  useState('Collection name');
  const [description, setDescription]  =  useState('Description');
  const disabledCollectionName = !(collectionName.length > 0);

  const [isLoading, setIsLoading] = useState(false);

  const handleCollectionNameInput = e => {
    setCollectionName(e.target.value);
  };

  const handleDescriptionInput = e => {
    setDescription(e.target.value);
  };

  const handleCollectionButtonClick = async () => {
    setIsLoading(true);

    try {
      const tx = await contract.createCollection(collectionName);
      await tx.wait();
      
    } catch (e) {
      console.log('e', e);
    } finally {
      setIsLoading(false);
    }
   };

    useEffect(() => {
    if (providerData) {
      const _contract = new ethers.Contract(
        '0x8b737597d6bc9C7e16D23B470D7ec4e42023f0F9',
        walletABI.abi,
        providerData.signer,
      );

      setContract(_contract);
    }
  }, [providerData]);

  return (
    <div className="container my-5">
      <h1 align="middle">Collection</h1>
     
        <div align="middle">
         <input
            className="form-control mt-2"
            onChange={handleCollectionNameInput}
            value={collectionName}
            type="text" 
            align="middle"       
            style={{ height: '34px', width:'400px', lineHeight: '34px', borderRadius: '2px' }}      
          />   
      </div>

     {disabledCollectionName ? <div style={{ color: `red` }}>Collection name is required</div> : null} 

       <div align="middle">
        <input 
          className="form-control mt-2"
          onChange={handleDescriptionInput}
          value={description}
          type="text"  
          align="middle"
          style={{ height: '34px', width:'400px', lineHeight: '34px', borderRadius: '2px' }}    
        />
       </div>

        <div className="button-wrapper mt-3" align="middle">
           <Button loading={isLoading} onClick={handleCollectionButtonClick} type="primary">
               Create Collection
           </Button>
        </div>   
       
    </div>
  );
}

export default Collection;
