import React from 'react';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import background from './background.png';
import logo from './logo.svg';

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      // Prompt the user to connect their MetaMask wallet
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await accounts.wait();
      // Handle the connected accounts
      const selectedAccount = accounts[0];
      console.log('Connected account:', selectedAccount);
      
      // Perform further actions after successful connection
      // For example, you can fetch the user's balance or perform other Ethereum transactions
      
    } catch (error) {
      // Handle errors
      console.error('Error connecting to MetaMask:', error);
    }
    navigate('/patient');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: `url(${background})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
      <img src={logo} alt="Logo" style={{ width: '150px', marginBottom: '20px' }} />
      <Title level={1} style={{ color: '#1d3d6d', textAlign: 'center', marginBottom: '8px' }}>Welcome to your secure, trusted,<br /> and decentralized health care</Title>
      <Title level={3} style={{ color: '#1E1E1E', textAlign: 'center', marginTop: '8px' }}>Connect your blockchain wallet to access this <br />decentralized health care system</Title>
      <Button type="primary" size="large" style={{ marginTop: '20px' }} onClick={handleClick}>Connect your wallet</Button>
    </div>
  );
};

export default LoginPage;