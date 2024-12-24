import React from 'react';
import { Box, Typography } from '@mui/material';

import PayrollRuns from '../components/PayrollRuns';
import PayrollList from '../components/PayrollList';

const PayrollRunsPage: React.FC = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Payroll Management
      </Typography>
      <PayrollRuns />
      <PayrollList />
    </Box>
  );
};

export default PayrollRunsPage;