import React from 'react';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import background from './background.png';
import logo from './logo.svg';

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const handleClick = () => {
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