// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import EmployeeManagement from './pages/EmployeeManagement';
import PayrollRunsPage from './pages/PayrollManagement';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header />
        <Container maxWidth="lg" sx={{ flex: 1, mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/employees" element={<EmployeeManagement />} />
            <Route path="/payroll-runs" element={<PayrollRunsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
        <Footer />
      </Box>
    </Router>
  );
};

export default App;
