import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container, Alert } from '@mui/material';
import Header from './components/Common/Header';
import Dashboard from './components/Dashboard/Dashboard';
import BlockExplorer from './components/Blocks/BlockExplorer';
import NetworkStatus from './components/Network/NetworkStatus';
import ConnectionSetup from './components/Common/ConnectionSetup';
import blockchainAPI, { setNodeUrl } from './services/api';

function App() {
  const [chainLength, setChainLength] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  const handleConnect = async (nodeUrl) => {
    setIsConnecting(true);
    setConnectionError('');
    
    try {
      setNodeUrl(nodeUrl);
      // Test the connection by fetching the chain
      const data = await blockchainAPI.getChain();
      setChainLength(data.length);
      setIsConnected(true);
    } catch (error) {
      setConnectionError('Failed to connect to node. Please check the URL and make sure the node is running.');
      console.error('Connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    let interval;
    if (isConnected) {
      const fetchChainLength = async () => {
        try {
          const data = await blockchainAPI.getChain();
          setChainLength(data.length);
        } catch (error) {
          console.error('Error fetching chain length:', error);
        }
      };

      fetchChainLength();
      interval = setInterval(fetchChainLength, 5000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {isConnected ? (
        <>
          <Header chainLength={chainLength} />
          <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/blocks" element={<BlockExplorer />} />
              <Route path="/network" element={<NetworkStatus />} />
            </Routes>
          </Container>
        </>
      ) : (
        <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
          {connectionError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {connectionError}
            </Alert>
          )}
          <ConnectionSetup 
            onConnect={handleConnect}
            isConnecting={isConnecting}
          />
        </Container>
      )}
    </Box>
  );
}

export default App;
