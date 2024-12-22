// src/components/PayrollList.tsx

import React, { useEffect, useState } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { fetchPayrollRuns } from '../services/api';
import { PayrollRun } from '../types/types';
import PayrollDetails from './PayrollDetails';

const PayrollList: React.FC = () => {
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedPayrollRunId, setSelectedPayrollRunId] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  useEffect(() => {
    const getPayrollRuns = async () => {
      try {
        const data = await fetchPayrollRuns();
        setPayrollRuns(data);
      } catch (err) {
        setError('Failed to fetch payroll runs.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getPayrollRuns();
  }, []);

  const handleViewDetails = (id: number) => {
    setSelectedPayrollRunId(id);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedPayrollRunId(null);
    setDetailsOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Loading payroll runs...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center" mt={4}>
        {error}
      </Typography>
    );
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Payroll Runs
      </Typography>
      <TableContainer component={Paper} style={{ marginTop: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Payroll Period</strong></TableCell>
              <TableCell><strong>Date Processed</strong></TableCell>
              <TableCell><strong>Notes</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payrollRuns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No payroll runs found.
                </TableCell>
              </TableRow>
            ) : (
              payrollRuns.map((run) => (
                <TableRow key={run.id}>
                  <TableCell>{run.id}</TableCell>
                  <TableCell>{`${new Date(run.payroll_period_start).toLocaleDateString()} - ${new Date(run.payroll_period_end).toLocaleDateString()}`}</TableCell>
                  <TableCell>{new Date(run.date_processed).toLocaleString()}</TableCell>
                  <TableCell>{run.notes || '-'}</TableCell>
                  <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleViewDetails(run.id)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Payroll Details Dialog */}
      <PayrollDetails
        open={detailsOpen}
        onClose={handleCloseDetails}
        payrollRunId={selectedPayrollRunId}
      />
    </div>
  );
};

export default PayrollList;
