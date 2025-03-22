import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert
} from '@mui/material';
import blockchainAPI from '../../services/api';

const BlockExplorer = () => {
  const [chainData, setChainData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChainData = async () => {
      try {
        const data = await blockchainAPI.getChain();
        setChainData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch blockchain data');
        console.error('Error fetching chain data:', err);
      }
    };

    fetchChainData();
    const interval = setInterval(fetchChainData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!chainData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Blockchain Explorer
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Block #</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Previous Hash</TableCell>
              <TableCell>Proof</TableCell>
              <TableCell>Mined By</TableCell>
              <TableCell>Transactions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chainData.chain.map((block) => (
              <TableRow key={block.index}>
                <TableCell>{block.index}</TableCell>
                <TableCell>
                  {new Date(block.timestamp * 1000).toLocaleString()}
                </TableCell>
                <TableCell>
                  {block.previous_hash.slice(0, 20)}...
                </TableCell>
                <TableCell>{block.proof}</TableCell>
                <TableCell>{block.mined_by}</TableCell>
                <TableCell>{block.transactions.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BlockExplorer; 