import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

const useProvider = () => {
  const [providerData, setProviderData] = useState();

  useEffect(() => {
    const getProviderData = async () => {
      const providerOptions = {
        /* See Provider Options Section */
      };

      const web3Modal = new Web3Modal({
        network: 'sepolia', // optional
        cacheProvider: true, // optional
        providerOptions, // required
      });

      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const { chainId } = await provider.getNetwork();
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      const userBalanceBN = await signer.getBalance();
      const userBalance = ethers.utils.formatEther(userBalanceBN.toString());

      setProviderData({
        provider,
        chainId,
        signer,
        signerData: {
          userAddress,
          userBalance,
        },
      });
    };

    getProviderData();
  }, []);

  return providerData;
};

export default useProvider;
