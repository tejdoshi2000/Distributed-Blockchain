import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import blockchainAPI from '../../services/api';

const NetworkStatus = () => {
  const [networkData, setNetworkData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const data = await blockchainAPI.getNodes();
        setNetworkData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch network data');
        console.error('Error fetching network data:', err);
      }
    };

    fetchNetworkData();
    const interval = setInterval(fetchNetworkData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!networkData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // Combine all nodes including bootstrap and local node
  const allNodes = [
    networkData.bootstrap_node,
    ...networkData.all_nodes
  ].filter(Boolean); // Remove any null/undefined values

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Network Status
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Network Overview
        </Typography>
        <Typography>Total Nodes: {networkData.total_nodes}</Typography>
        <Typography>Local Node: {networkData.local_node || 'Not running'}</Typography>
        <Typography>Bootstrap Node: {networkData.bootstrap_node}</Typography>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Connected Nodes
        </Typography>
        <List>
          {allNodes.map((node, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={node} 
                secondary={node === networkData.bootstrap_node ? 'Bootstrap Node' : 
                          node === networkData.local_node ? 'Local Node' : 'Remote Node'}
              />
            </ListItem>
          ))}
          {allNodes.length === 0 && (
            <ListItem>
              <ListItemText primary="No connected nodes" />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default NetworkStatus; 