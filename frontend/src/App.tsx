import React from 'react';
import { Container, Typography, Grid } from '@mui/material'

import EmployeeList from './components/EmployeeList'
import PayrollList from './components/PayrollList';
import AddWorkEntries from './components/AddWorkEntries';

const App: React.FC = () => {

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h1" align="center" gutterBottom>
        ClearOps Payroll System
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <EmployeeList />
        </Grid>
        <Grid item xs={12} md={6}>
          <AddWorkEntries />
        </Grid>
        <Grid item xs={12}>
          <PayrollList />
        </Grid>
      </Grid>
    </Container>
  )
}

export default App
