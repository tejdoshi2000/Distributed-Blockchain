import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Button, CircularProgress, Alert } from '@mui/material';
import blockchainAPI from '../../services/api';

const Dashboard = () => {
  const [chainData, setChainData] = useState(null);
  const [error, setError] = useState('');
  const [isMining, setIsMining] = useState(false);
  const [miningError, setMiningError] = useState('');

  const fetchChainData = async () => {
    try {
      const data = await blockchainAPI.getChain();
      setChainData(data);
      setError('');
    } catch (error) {
      setError('Failed to fetch blockchain data');
      console.error('Error fetching chain data:', error);
    }
  };

  useEffect(() => {
    fetchChainData();
    const interval = setInterval(fetchChainData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMine = async () => {
    setIsMining(true);
    setMiningError('');
    
    try {
      const result = await blockchainAPI.mine();
      console.log('Mining result:', result);
      fetchChainData(); // Refresh chain data
    } catch (error) {
      console.error('Mining error:', error);
      setMiningError(error.response?.data?.message || 'Failed to mine block. Please try again.');
    } finally {
      setIsMining(false);
    }
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!chainData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const lastBlock = chainData.chain[chainData.chain.length - 1];

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* Mining Control Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Mining Control
            </Typography>
            {miningError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {miningError}
              </Alert>
            )}
            <Button
              variant="contained"
              onClick={handleMine}
              disabled={isMining}
              sx={{ mt: 2 }}
            >
              {isMining ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Mining...
                </>
              ) : (
                'Mine New Block'
              )}
            </Button>
          </Paper>
        </Grid>

        {/* Blockchain Overview */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Blockchain Overview
            </Typography>
            <Typography>
              Current Chain Length: {chainData.length}
            </Typography>
            <Typography>
              Last Block Index: {lastBlock.index}
            </Typography>
            <Typography>
              Last Block Hash: {lastBlock.previous_hash}
            </Typography>
            <Typography>
              Last Block Proof: {lastBlock.proof}
            </Typography>
            <Typography>
              Last Block Mined By: {lastBlock.mined_by}
            </Typography>
          </Paper>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            {lastBlock.transactions.length > 0 ? (
              <Box>
                {lastBlock.transactions.map((tx, index) => (
                  <Box key={index} mb={1}>
                    <Typography variant="body2">
                      From: {tx.sender}
                    </Typography>
                    <Typography variant="body2">
                      To: {tx.recipient}
                    </Typography>
                    <Typography variant="body2">
                      Amount: {tx.amount}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography>No recent transactions</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 