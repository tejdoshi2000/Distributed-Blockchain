import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider
} from '@mui/material';

const ConnectionSetup = ({ onConnect, isConnecting }) => {
  const [nodeUrl, setNodeUrl] = useState('');
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Basic URL validation
    if (!nodeUrl) {
      setError('Please enter a node URL');
      return;
    }

    // Remove http:// or https:// if present
    const cleanUrl = nodeUrl.replace(/^https?:\/\//, '');
    
    // Validate format (IP:PORT or localhost:PORT)
    if (!/^((localhost|(\d{1,3}\.){3}\d{1,3})):\d+$/.test(cleanUrl)) {
      setError('Invalid format. Use IP:PORT or localhost:PORT');
      return;
    }

    onConnect(cleanUrl);
  };

  const steps = [
    {
      label: 'Start Your Node',
      description: (
        <Box>
          <Typography variant="body2" paragraph>
            First, start your local node:
          </Typography>
          <Typography variant="body2" paragraph>
            1. Open a terminal/command prompt
          </Typography>
          <Typography variant="body2" paragraph>
            2. Navigate to the project directory
          </Typography>
          <Typography variant="body2" paragraph>
            3. Run the Python script:
            <Box 
              component="pre" 
              sx={{ 
                bgcolor: '#2d2d2d', 
                p: 2, 
                borderRadius: 1, 
                mt: 1,
                color: '#fff',
                fontFamily: 'monospace',
                border: '1px solid #404040'
              }}
            >
              python tryout2.py
            </Box>
          </Typography>
          <Typography variant="body2" paragraph>
            4. When prompted:
            <Box component="ul" sx={{ mt: 1, pl: 2 }}>
              <li>Enter your desired port number (e.g., 5001, 5002, etc.)</li>
            </Box>
          </Typography>
        </Box>
      )
    },
    {
      label: 'Connect to Your Node',
      description: (
        <Box>
          <Typography variant="body2" paragraph>
            Enter your local node's address in the format:
          </Typography>
          <Box 
            component="pre" 
            sx={{ 
              bgcolor: '#2d2d2d', 
              p: 2, 
              borderRadius: 1, 
              mb: 2,
              color: '#fff',
              fontFamily: 'monospace',
              border: '1px solid #404040'
            }}
          >
            localhost:PORT
          </Box>
          <Typography variant="body2" color="text.secondary">
            Example: localhost:5001
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Note: Make sure your node is running before connecting.
          </Typography>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Connect to Blockchain Network
        </Typography>
        
        <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                {step.description}
                {index === steps.length - 1 && (
                  <Box sx={{ mt: 2 }}>
                    <Divider sx={{ my: 2 }} />
                    <form onSubmit={handleSubmit}>
                      <TextField
                        fullWidth
                        label="Node URL"
                        placeholder="localhost:5001"
                        value={nodeUrl}
                        onChange={(e) => setNodeUrl(e.target.value)}
                        disabled={isConnecting}
                        sx={{ mb: 2 }}
                      />
                      {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                          {error}
                        </Alert>
                      )}
                      <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={isConnecting}
                      >
                        {isConnecting ? (
                          <>
                            <CircularProgress size={24} sx={{ mr: 1 }} />
                            Connecting...
                          </>
                        ) : (
                          'Connect to Node'
                        )}
                      </Button>
                    </form>
                  </Box>
                )}
              </StepContent>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prevStep) => prevStep - 1)}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={() => setActiveStep((prevStep) => prevStep + 1)}
            disabled={activeStep === steps.length - 1}
          >
            Next
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ConnectionSetup; 