import React from 'react';
import EmployeeList from '../components/EmployeeList';
import { Typography, Box } from '@mui/material';

const EmployeeManagement: React.FC = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Employee Management
      </Typography>
      <EmployeeList />
    </Box>
  );
};

export default EmployeeManagement;
