import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import useProvider from '../hooks/useProvider';
import walletABI from '../sdk/artifacts/contracts/Wallet.sol/Wallet.json';
import Button from '../components/ui/Button';

const Deposit = () => {
  const providerData = useProvider();

  const [contract, setContract] = useState();
  const [userBalance, setUserBalance] = useState('0');
  const [amount, setAmount] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  const handleAmountChange = e => {
    const { value } = e.target;
    setAmount(value);
  };

  useEffect(() => {
    if (providerData) {
      const _contract = new ethers.Contract(
        '0xBE8e0dEBE87e648c5C912021652c500647a40066',
        walletABI.abi,
        providerData.signer,
      );

      setContract(_contract);
    }
  }, [providerData]);

  const getBalance = useCallback(async () => {
    const result = await contract.userBalance(providerData.signerData.userAddress);
    const balanceFormatted = ethers.utils.formatEther(result);
    setUserBalance(balanceFormatted);
  }, [contract, providerData]);

  useEffect(() => {
    contract && getBalance();
  }, [contract, providerData, getBalance]);

  const handleDepositButtonClick = async () => {
    setIsLoading(true);

    try {
      const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
      await tx.wait();

      await getBalance();
    } catch (e) {
      console.log('e', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container my-5 my-lg-10">
      <div className="row">
        <div className="col-6">
          <div className="d-flex align-items-center">
            <div>
              <input
                type="text"
                className="form-control"
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
            <div className="ms-3">
              <Button loading={isLoading} onClick={handleDepositButtonClick} type="primary">
                Deposit
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">{userBalance} ETH</div>
    </div>
  );
};

export default Deposit;
