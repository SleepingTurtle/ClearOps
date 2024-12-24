import React from 'react';
import { Typography, Box } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Welcome to ClearOps Payroll System
      </Typography>
      <Typography variant="body1">
        Use the navigation bar to manage employees and payroll runs.
      </Typography>
    </Box>
  );
};

export default Home;