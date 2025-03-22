import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Header = ({ chainLength }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Blockchain Network
        </Typography>
        <Typography variant="body2" sx={{ mr: 2 }}>
          Chain Length: {chainLength}
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/blocks">
            Blocks
          </Button>
          <Button color="inherit" component={RouterLink} to="/network">
            Network
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 