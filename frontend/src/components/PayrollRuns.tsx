// src/components/PayrollRuns.tsx

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, CircularProgress, Alert } from '@mui/material';
import CreatePayrollRun from './CreatePayrollRun';
import AddWorkEntries from './AddWorkEntries';
import { PayrollRun, WorkEntry } from '../types/types';
import { fetchPayrollRuns } from '../services/api';

const PayrollRuns: React.FC = () => {
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentPayrollRun, setCurrentPayrollRun] = useState<PayrollRun | null>(null);

  const loadPayrollRuns = async () => {
    setLoading(true);
    setError('');
    try {
      const runs = await fetchPayrollRuns();
      setPayrollRuns(runs);
      // Determine the active payroll run (not closed)
      const activeRun = runs.find(run => !run.is_closed);
      setCurrentPayrollRun(activeRun || null);
    } catch (err) {
      setError('Failed to fetch payroll runs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayrollRuns();
  }, []);

  const handlePayrollRunUpdated = () => {
    loadPayrollRuns();
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
          <CreatePayrollRun />
        </Grid>
      </Grid>

      {currentPayrollRun ? (
        <AddWorkEntries
          currentPayrollRun={currentPayrollRun}
          onPayrollRunUpdated={handlePayrollRunUpdated}
        />
      ) : (
        <Box mt={4}>
          <Typography variant="h6">
            No active payroll run. Please create a new payroll run to start entering work entries.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PayrollRuns;
