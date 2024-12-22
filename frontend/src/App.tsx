import React from 'react';
import { Container, Typography } from '@mui/material'

import EmployeeList from './components/EmployeeList'

const App: React.FC = () => {

  return (
    <Container>
      <Typography variant="h1" align="center" gutterBottom style={{ marginTop: '2rem' }}>
        ClearOps Payroll System
      </Typography>
      <EmployeeList />
    </Container>
  )
}

export default App
